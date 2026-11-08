import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Bản web frontend/ đã bị xóa nên không còn so URL ảnh với HomePage.tsx cũ.
const nativeProductCard = await readFile(new URL('../src/components/ProductCard.tsx', import.meta.url), 'utf8');
assert.match(nativeProductCard, /imageUrl\(product\.imageUrl\)/, 'ProductCard phải hiển thị nguyên product.imageUrl qua hàm ánh xạ URL.');
console.log('Đã xác minh ProductCard giữ nguyên product.imageUrl.');
