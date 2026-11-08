// file kiểm thử đăng xuất trên frontend-native: sau clearToken, request không còn gửi Authorization (US09).
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadNativeApi } from './native-api.mjs';

const { api, storage, sent } = await loadNativeApi();

test('QA-F08 logout removes the stored token so later API calls are anonymous (US09)', async () => {
  await api.saveToken('jwt-abc');
  assert.equal(await api.getToken(), 'jwt-abc');
  await api.accountApi.me();
  assert.equal(sent.at(-1).headers.Authorization, 'Bearer jwt-abc');
  assert.equal(sent.at(-1).url, '/api/auth/me');

  await api.clearToken();
  assert.equal(await api.getToken(), null);
  assert.equal(storage.has('giadung_token'), false);
  await api.accountApi.me();
  assert.equal(sent.at(-1).headers.Authorization, undefined);
});
