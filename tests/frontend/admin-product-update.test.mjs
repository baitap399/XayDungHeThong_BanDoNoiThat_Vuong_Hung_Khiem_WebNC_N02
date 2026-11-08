// file kiểm thử luồng sửa sản phẩm ở giao diện quản trị frontend-native: kiểm tra form rồi gửi PATCH kèm token (US28, test case QT03).
import assert from 'node:assert/strict';
import test from 'node:test';
import { adminProductValidationErrors } from '../../frontend-native/src/adminProducts.mjs';
import { loadNativeApi } from './native-api.mjs';

const { api, sent } = await loadNativeApi();

test('QA-F09 admin product edit form rejects invalid values before any request is sent', () => {
  const before = sent.length;
  assert.deepEqual(adminProductValidationErrors({ name: '', price: 'abc', stock: '-2' }), {
    name: 'Vui lòng nhập tên sản phẩm.',
    price: 'Giá phải là số từ 0 trở lên.',
    stock: 'Tồn kho phải là số nguyên từ 0 trở lên.',
  });
  assert.equal(sent.length, before);
});

test('QA-F10 saving an edited product sends multipart PATCH /api/products/:id with the admin token (QT03)', async () => {
  const values = { name: 'Nồi chiên 6L', price: '1690000', stock: '4' };
  assert.deepEqual(adminProductValidationErrors(values), {});
  await api.saveToken('admin-jwt');
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.append(key, value);
  const saved = await api.productApi.update(5, form);

  const request = sent.at(-1);
  assert.equal(request.method, 'PATCH');
  assert.equal(request.url, '/api/products/5');
  assert.equal(request.headers.Authorization, 'Bearer admin-jwt');
  // Multipart: trình duyệt tự đặt boundary, client không được ép Content-Type JSON.
  assert.equal(request.headers['Content-Type'], undefined);
  assert.equal(request.body.get('name'), 'Nồi chiên 6L');
  assert.equal(request.body.get('price'), '1690000');
  assert.equal(saved.name, 'Nồi chiên 6L');
});
