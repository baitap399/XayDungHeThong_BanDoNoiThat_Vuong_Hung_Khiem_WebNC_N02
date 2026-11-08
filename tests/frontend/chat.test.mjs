// file kiểm thử chatbot trên frontend-native: chatApi.send thật gửi đúng dữ liệu, giữ tiếng Việt/emoji và báo lỗi thay vì coi là thành công.
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadNativeApi } from './native-api.mjs';

const { api, sent } = await loadNativeApi();
const original = globalThis.fetch;
// Trả về phản hồi định sẵn cho request kế tiếp, vẫn ghi lại request vào `sent`.
const respond = (status, body) => {
  globalThis.fetch = async (url, init) => {
    globalThis.fetch = original;
    sent.push({ url, method: init?.method ?? 'GET', headers: init?.headers ?? {}, body: init?.body });
    return new Response(body === undefined ? null : JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  };
};
const lastBody = () => JSON.parse(sent.at(-1).body);

test('QA-F11 a plain chat message is POSTed as JSON with its session and no action fields', async () => {
  respond(200, { message: 'Chào bạn', source: 'smalltalk' });
  const reply = await api.chatApi.send('xin chào', 'session-1');
  assert.equal(sent.at(-1).url, '/api/chat');
  assert.equal(sent.at(-1).method, 'POST');
  assert.equal(sent.at(-1).headers['Content-Type'], 'application/json');
  assert.deepEqual(lastBody(), { message: 'xin chào', sessionId: 'session-1' });
  assert.equal(reply.message, 'Chào bạn');
});

test('QA-F12 a chat action sends its type and options, drops the label and adds a requestId', async () => {
  respond(200, { message: 'Đã thêm vào giỏ' });
  await api.chatApi.send('Thêm vào giỏ', 'session-1', { type: 'add_to_cart', label: 'Thêm vào giỏ', productId: 7, quantity: 2 });
  const body = lastBody();
  assert.equal(body.action, 'add_to_cart');
  assert.equal(body.productId, 7);
  assert.equal(body.quantity, 2);
  assert.equal('label' in body, false);
  assert.match(body.requestId, /^\d+-[a-z0-9]+$/);
});

test('QA-F13 every action click gets a different requestId so retries stay idempotent per click', async () => {
  const action = { type: 'checkout_place_order', label: 'Đặt hàng', checkoutId: 'c1' };
  respond(200, { message: 'ok' });
  await api.chatApi.send('Đặt hàng', 's', action);
  const first = lastBody().requestId;
  respond(200, { message: 'ok' });
  await api.chatApi.send('Đặt hàng', 's', action);
  assert.notEqual(lastBody().requestId, first);
});

test('QA-F14 Vietnamese text and emoji survive the request and the reply unchanged', async () => {
  const message = 'Tôi muốn mua nồi chiên 🍳 giá dưới 2 triệu, giao Đà Nẵng';
  const answer = 'Dạ, đây là 3 mẫu nồi chiên phù hợp ✅';
  respond(200, { message: answer });
  const reply = await api.chatApi.send(message, 's');
  assert.equal(lastBody().message, message);
  assert.equal(reply.message, answer);
});

test('QA-F15 backend validation errors reject with their message and status, never as a reply', async () => {
  respond(400, { message: ['message must be shorter than 1000 characters', 'sessionId must be a string'] });
  await assert.rejects(api.chatApi.send('x'.repeat(2000), 's'), error => {
    assert.ok(error instanceof api.ApiError);
    assert.equal(error.status, 400);
    assert.equal(error.message, 'message must be shorter than 1000 characters. sessionId must be a string');
    return true;
  });
});

test('QA-F16 a failed response without a JSON body rejects with a generic message', async () => {
  respond(503);
  await assert.rejects(api.chatApi.send('còn hàng không?', 's'), { name: 'Error', message: 'Yêu cầu thất bại (503)' });
});
