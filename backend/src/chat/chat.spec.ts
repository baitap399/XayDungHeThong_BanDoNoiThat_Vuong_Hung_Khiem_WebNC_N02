import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JwtStrategy } from '../auth/jwt.strategy';
import { ChatbotKnowledge, KnowledgeStatus } from '../database/entities/chatbot-knowledge.entity';
import { Product } from '../database/entities/product.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatProductsService, productQuery } from './chat-products.service';
import { questionKey, similarity } from './chat-matching';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';

function memoryKnowledge() {
  const rows: ChatbotKnowledge[] = [];
  const matches = (row: ChatbotKnowledge, where: Record<string, unknown>) => Object.entries(where).every(([key, value]) => row[key as keyof ChatbotKnowledge] === value);
  const repo = {
    find: async ({ where }: any) => rows.filter(row => matches(row, where)),
    findOneBy: async (where: any) => rows.find(row => matches(row, where)) ?? null,
    findAndCount: async ({ where, skip, take }: any) => {
      const found = rows.filter(row => matches(row, where));
      return [found.slice(skip, skip + take), found.length];
    },
    create: (row: any) => row,
    insert: async (data: any) => {
      if (rows.some(row => row.questionKey === data.questionKey && row.contextHash === data.contextHash)) throw { code: 'ER_DUP_ENTRY' };
      rows.push({ id: rows.length + 1, createdAt: new Date(), updatedAt: new Date(), ...data });
    },
    save: async (row: any) => {
      if (!row.id) { await repo.insert(row); return rows.at(-1); }
      Object.assign(rows.find(item => item.id === row.id)!, row);
      return row;
    },
    update: async (where: any, patch: any) => {
      const found = rows.filter(row => matches(row, where));
      found.forEach(row => Object.assign(row, patch));
      return { affected: found.length };
    },
    increment: async (where: any, key: 'usageCount', value: number) => {
      const found = rows.filter(row => matches(row, where));
      found.forEach(row => row[key] += value);
      return { affected: found.length };
    },
    delete: async (id: number) => {
      const index = rows.findIndex(row => row.id === id);
      if (index < 0) return { affected: 0 };
      rows.splice(index, 1);
      return { affected: 1 };
    },
    createQueryBuilder: () => {
      const query: any = {
        where: () => query, andWhere: () => query, orderBy: () => query, addOrderBy: () => query, take: () => query,
        getMany: async () => rows.filter(row => row.status === KnowledgeStatus.APPROVED && !row.contextHash),
      };
      return query;
    },
  };
  return { rows, repo };
}

test('matching preserves numbers, negation and different policy questions', () => {
  assert.equal(questionKey('Shop có giao hàng không?'), questionKey('Shop có ship hàng không?'));
  assert.equal(similarity('Shop có giao hàng không?', 'Cửa hàng có giao hàng không ạ?'), 1);
  assert.equal(similarity('Có ghế dưới 2 triệu không?', 'Có ghế dưới 3 triệu không?'), 0);
  assert.equal(similarity('Có ghế dưới 2 triệu không?', 'Có ghế trên 2 triệu không?'), 0);
  assert.ok(similarity('Shop có giao hàng không?', 'Shop có giao hàng miễn phí không?') < 0.9);
  assert.ok(similarity('Shop có giao hàng không?', 'Shop có đổi trả không?') < 0.9);
  assert.ok(similarity('Shop có giao hàng không?', 'Shop có giao hàng Hà Nội không?') < 0.9);
});

test('product budgets parse Vietnamese amounts and do not interpret greetings as furniture', () => {
  assert.equal(productQuery('Xin chào bạn').related, false);
  assert.equal(productQuery('Shop có giao hàng Hà Nội không?').related, false);
  assert.deepEqual(productQuery('Máy hút bụi Dyson dưới 2 triệu').terms, ['may hut bui', 'dyson']);
  assert.equal(productQuery('Có ghế dưới 2 triệu không?').maxPrice, 2000000);
  assert.equal(productQuery('Có ghế dưới 2 triệu không?').maxExclusive, true);
  assert.equal(productQuery('Ghế không quá 2.000.000 đồng').maxExclusive, false);
  assert.equal(productQuery('Ghế dưới 1,5 triệu').maxPrice, 1500000);
  assert.equal(productQuery('Ghế dưới 500k').maxPrice, 500000);
  assert.equal(productQuery('Ghế từ 1 đến 2 triệu').minPrice, 1000000);
  assert.equal(productQuery('Ghế từ 1 đến 2 triệu').maxPrice, 2000000);
  assert.equal(productQuery('Phòng 10m2 nên chọn bàn nào?').related, true);
});

test('product lookup emits bounded parameterized MySQL with current price/stock filters', async () => {
  const source = new DataSource({ type: 'mysql', database: 'chat_test_metadata_only', entities: [Product, ChatbotKnowledge] });
  await (source as unknown as { buildMetadatas(): Promise<void> }).buildMetadatas();
  let queries = 0;
  let sql = '';
  let params: unknown[] = [];
  const products = new ChatProductsService({ createQueryBuilder: () => {
    const qb = source.getRepository(Product).createQueryBuilder('p');
    qb.getRawMany = async () => { queries++; [sql, params] = qb.getQueryAndParameters(); return []; };
    return qb;
  } } as unknown as Repository<Product>);
  assert.equal(await products.context('Xin chào'), null);
  assert.equal(queries, 0);
  const context = await products.context('Có ghế dưới 2 triệu không?');
  assert.deepEqual(context?.products, []);
  assert.match(sql, /LIMIT 5/);
  assert.match(sql, /`p`\.`stock` > 0/);
  assert.match(sql, /`p`\.`price` < \?/);
  assert.deepEqual(params, ['%ghe%', 2000000]);
  assert.ok(!sql.includes('2000000'));
  const meta = source.getMetadata(ChatbotKnowledge);
  assert.equal(meta.tableName, 'chatbot_knowledge');
  assert.ok(meta.indices.some(index => index.isUnique && index.columns.map(column => column.databaseName).join(',') === 'question_key,context_hash'));
});

test('HTTP chat and admin lifecycle uses existing JWT/roles, approved cache, pending and safe error responses', async (t) => {
  const memory = memoryKnowledge();
  let snapshot = 'current-products';
  let productLookups = 0;
  const products = { context: async (message: string) => {
    if (!productQuery(message).related) return null;
    productLookups++;
    return { hash: snapshot, products: [{ id: 7, name: 'Ghế gỗ', price: '1500000', stock: 2 }] };
  } };
  const config = new ConfigService({ JWT_SECRET: 'chat-test-only-secret', GEMINI_API_KEY: 'test-only-not-a-real-key' });
  const module = await Test.createTestingModule({
    controllers: [ChatController, KnowledgeController],
    providers: [ChatService, KnowledgeService, JwtStrategy,
      { provide: ConfigService, useValue: config },
      { provide: ChatProductsService, useValue: products },
      { provide: getRepositoryToken(ChatbotKnowledge), useValue: memory.repo }],
  }).compile();
  const app = module.createNestApplication({ logger: false });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  await app.listen(0, '127.0.0.1');
  t.after(() => app.close());
  const base = await app.getUrl();
  const chat = module.get(ChatService);
  let calls = 0;
  let failure: unknown = null;
  let lastRequest: any;
  chat['ai']!.models.generateContent = async (request) => {
    calls++; lastRequest = request;
    if (failure) throw failure;
    return { text: 'Câu trả lời kiểm thử.' } as any;
  };
  const jwt = new JwtService({ secret: 'chat-test-only-secret' });
  const token = (role: string) => jwt.sign({ sub: 1, role, email: 'test@example.test' });
  const request = async (path: string, method = 'GET', body?: unknown, role?: string) => {
    const response = await fetch(`${base}/api${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(role ? { Authorization: `Bearer ${token(role)}` } : {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    return { status: response.status, data: await response.json() as any };
  };
  const send = (message: unknown) => request('/chat', 'POST', { message });
  const admin = '/admin/chatbot/knowledge';

  for (const [method, path] of [['GET', admin], ['GET', `${admin}/1`], ['POST', admin], ['PATCH', `${admin}/1`], ['PATCH', `${admin}/1/approve`], ['PATCH', `${admin}/1/reject`], ['DELETE', `${admin}/1`], ['GET', '/admin/chatbot/stats']]) {
    assert.equal((await request(path, method, undefined, 'USER')).status, 403);
    assert.equal((await request(path, method)).status, 401);
  }
  for (const message of ['', '   ', 42, null, 'x'.repeat(1001)]) assert.equal((await send(message)).status, 400);
  assert.equal((await request('/chat', 'POST', {})).status, 400);
  assert.equal((await request('/chat', 'POST', { message: 'Xin chào', status: 'approved' })).status, 400);
  assert.equal(calls, 0);

  assert.equal((await send('Xin chào')).data.source, 'gemini');
  assert.equal(lastRequest.contents, JSON.stringify({ question: 'Xin chào' }));
  assert.equal(lastRequest.config.httpOptions.retryOptions.attempts, 1);
  assert.equal((await send('Shop có giao hàng không?')).data.source, 'gemini');
  const shipping = memory.rows.find(row => row.question.includes('giao hàng'))!;
  assert.equal(shipping.status, 'pending');
  assert.equal(shipping.usageCount, 0);
  assert.equal((await send('Shop có giao hàng không?')).data.source, 'gemini');
  assert.equal(memory.rows.filter(row => row.question.includes('giao hàng')).length, 1);
  assert.equal((await request(`${admin}/${shipping.id}/approve`, 'PATCH', undefined, 'ADMIN')).status, 200);
  const beforeHit = calls;
  assert.equal((await send('Shop có ship hàng không?')).data.source, 'knowledge');
  assert.equal((await send('Cửa hàng có giao hàng không ạ?')).data.knowledgeId, shipping.id);
  assert.equal(calls, beforeHit);
  assert.equal(shipping.usageCount, 2);

  assert.equal((await send('Có ghế dưới 2 triệu không?')).data.source, 'product');
  assert.ok(productLookups > 0);
  assert.equal(JSON.parse(lastRequest.contents).products[0].price, '1500000');
  const chair = memory.rows.find(row => row.contextHash)!;
  await request(`${admin}/${chair.id}/approve`, 'PATCH', undefined, 'ADMIN');
  const beforeProductHit = calls;
  assert.equal((await send(chair.question)).data.source, 'knowledge');
  assert.equal(calls, beforeProductHit);
  snapshot = 'changed-price-or-stock';
  assert.equal((await send(chair.question)).data.source, 'product');
  assert.equal((await request(`${admin}/${chair.id}/approve`, 'PATCH', undefined, 'ADMIN')).status, 409);
  assert.equal(memory.rows.filter(row => row.question === chair.question).length, 2);

  assert.equal((await send('Một câu hỏi hoàn toàn mới')).data.source, 'gemini');
  assert.equal(memory.rows.at(-1)?.status, 'pending');
  assert.equal((await request(admin, 'GET', undefined, 'ADMIN')).status, 200);
  assert.equal((await request(`${admin}?status=invalid`, 'GET', undefined, 'ADMIN')).status, 400);
  assert.equal((await request(`${admin}/abc`, 'GET', undefined, 'ADMIN')).status, 400);
  assert.equal((await request(`${admin}/${shipping.id}`, 'PATCH', { answer: null }, 'ADMIN')).status, 400);
  const edited = await request(`${admin}/${shipping.id}`, 'PATCH', { answer: 'Nội dung đã được admin sửa.' }, 'ADMIN');
  assert.equal(edited.data.status, 'pending');
  await request(`${admin}/${shipping.id}/approve`, 'PATCH', undefined, 'ADMIN');
  assert.equal((await send(shipping.question)).data.message, 'Nội dung đã được admin sửa.');
  await request(`${admin}/${shipping.id}/reject`, 'PATCH', undefined, 'ADMIN');
  assert.equal((await send(shipping.question)).data.source, 'gemini');
  assert.equal(shipping.status, 'rejected');

  for (const [error, status] of [[{ status: 429, message: 'sensitive provider data' }, 429], [{ name: 'TimeoutError' }, 504], [{ status: 503 }, 503], [{ status: 500 }, 500]] as const) {
    failure = error;
    const before: number = calls;
    const result = await send('Câu hỏi chưa được duyệt');
    assert.equal(result.status, status);
    assert.equal(calls, before + 1);
    assert.ok(!JSON.stringify(result.data).includes('sensitive provider data'));
  }
  failure = null;
  const created = await request(admin, 'POST', { question: 'Xin chào', answer: 'Xin chào bạn!' }, 'ADMIN');
  assert.equal(created.status, 409); // same normalized question/context
  const manual = await request(admin, 'POST', { question: 'FAQ thủ công riêng', answer: 'Nội dung do admin xác nhận.' }, 'ADMIN');
  assert.equal(manual.data.status, 'pending');
  await request(`${admin}/${manual.data.id}/approve`, 'PATCH', undefined, 'ADMIN');
  const noKey = new ChatService(new ConfigService({ GEMINI_API_KEY: '' }), module.get(KnowledgeService), products as any);
  assert.equal((await noKey.send('FAQ thủ công riêng')).source, 'knowledge');
  await assert.rejects(noKey.send('Thiếu key và chưa có knowledge'), (error: any) => error.getStatus() === 503);
  const summary = await request('/admin/chatbot/stats', 'GET', undefined, 'ADMIN');
  assert.equal(summary.data.geminiCalls, calls);
  assert.ok(summary.data.knowledgeHits >= 4);
  assert.equal((await request(`${admin}/${manual.data.id}`, 'DELETE', undefined, 'ADMIN')).status, 200);
  assert.equal((await request(`${admin}/${manual.data.id}`, 'GET', undefined, 'ADMIN')).status, 404);

  const originalFind = memory.repo.find;
  memory.repo.find = async () => { throw new Error('database password must not leak'); };
  const dbFailure = await send('Xin chào');
  assert.equal(dbFailure.status, 503);
  assert.ok(!JSON.stringify(dbFailure.data).includes('password'));
  memory.repo.find = originalFind;
  const originalInsert = memory.repo.insert;
  memory.repo.insert = async () => { throw new Error('write unavailable'); };
  assert.equal((await send('Câu mới khi lưu dữ liệu lỗi')).status, 201);
  assert.equal(chat.stats().pendingSaveFailures, 1);
  memory.repo.insert = originalInsert;
});
