// Opt-in integration check: real MySQL, all test knowledge rolled back; --gemini makes one live AI call.
require('reflect-metadata');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { resolve } = require('node:path');
const { DataSource } = require('typeorm');
const { ConfigService } = require('@nestjs/config');
const { Product } = require('../dist/database/entities/product.entity');
const { ChatbotKnowledge, KnowledgeStatus } = require('../dist/database/entities/chatbot-knowledge.entity');
const { KnowledgeService } = require('../dist/chat/knowledge.service');
const { ChatProductsService } = require('../dist/chat/chat-products.service');
const { ChatService } = require('../dist/chat/chat.service');

async function verify() {
  process.loadEnvFile(resolve(__dirname, '../.env'));
  const source = new DataSource({
    type: 'mysql', host: process.env.DB_HOST, port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }, connectTimeout: 10000, charset: 'utf8mb4',
    entities: [Product, ChatbotKnowledge], synchronize: false, logging: false,
  });
  await source.initialize();
  const runner = source.createQueryRunner();
  try {
    await runner.startTransaction();
    const repo = runner.manager.getRepository(ChatbotKnowledge);
    const products = new ChatProductsService(runner.manager.getRepository(Product));
    const knowledge = new KnowledgeService(repo, products);
    const fixture = await knowledge.create({ question: `Xin chào, mã kiểm thử ${randomUUID()}`, answer: 'Xin chào! Tôi có thể hỗ trợ bạn chọn đồ gia dụng.' });
    assert.equal(fixture.status, 'pending');
    assert.equal((await knowledge.candidates(fixture.question)).length, 0);
    await knowledge.moderate(fixture.id, KnowledgeStatus.APPROVED);
    const hit = (await knowledge.candidates(fixture.question))[0];
    assert.equal(hit.id, fixture.id);
    assert.equal(await knowledge.use(hit), true);
    assert.equal((await knowledge.detail(hit.id)).usageCount, 1);
    const chairs = await products.context('Có ghế dưới 2 triệu không?');
    assert.ok(chairs);
    assert.ok(chairs.products.every(product => Number(product.price) < 2000000 && product.stock > 0));
    assert.ok(chairs.products.length <= 5);
    console.log('MySQL PASS: pending/approve/match/usage_count, bounded price/stock query.');

    if (process.argv.includes('--gemini')) {
      const chat = new ChatService(new ConfigService(process.env), knowledge, products);
      const question = `Xin chào! Đây là lần kiểm tra ${randomUUID()}.`;
      const first = await chat.send(question);
      assert.equal(first.source, 'gemini');
      assert.ok(first.message.length > 0);
      const pending = await repo.findOneByOrFail({ question });
      assert.equal(pending.status, 'pending');
      await knowledge.moderate(pending.id, KnowledgeStatus.APPROVED);
      const second = await chat.send(question);
      assert.equal(second.source, 'knowledge');
      assert.equal(chat.stats().geminiCalls, 1);
      console.log('Gemini PASS: real answer -> pending -> approved -> knowledge; one Gemini call for two chats.');
    }
  } finally {
    if (runner.isTransactionActive) await runner.rollbackTransaction();
    await runner.release();
    await source.destroy();
    console.log('Integration test knowledge rolled back.');
  }
}

verify().catch(error => {
  console.error('Chatbot integration check failed: ' + (error.getStatus?.() || error.code || error.name || 'UNKNOWN'));
  process.exitCode = 1;
});
