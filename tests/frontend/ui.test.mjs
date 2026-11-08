// file kiểm thử giao diện frontend-native: render component thật (react-native-web) cho giá sản phẩm, giỏ hàng và trang quản trị.
import assert from 'node:assert/strict';
import test from 'node:test';
import { h, loadNativeModule, renderNative } from './native-api.mjs';

// Store giả: trường nào test không khai báo sẽ là hàm rỗng (các component phụ như header, chat chỉ gọi hàm).
const storeWith = state => ({ useStore: () => new Proxy(state, { get: (target, key) => key in target ? target[key] : async () => {} }) });
const router = { useRouter: () => ({ push() {}, replace() {}, back() {} }), usePathname: () => '/', Link: ({ children }) => children };
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const render = (file, exportName, state, props = {}) => {
  const component = loadNativeModule(file, { '../store': storeWith(state), '../../store': storeWith(state), 'expo-router': router,
    'react-native-safe-area-context': { useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }) } })[exportName];
  return text(renderNative(h(component, props)));
};

const product = { id: 1, name: 'Nồi chiên không dầu 6L', category: 'Nhà bếp', price: 900_000, originalPrice: 1_000_000, discountPercent: 10, stock: 3, averageRating: 4, reviewCount: 2 };
const cardState = { favoriteIds: [], user: null };
const cartItem = (productId, name, price, quantity) => ({ productId, quantity, product: { id: productId, name, price, stock: 10, imageUrl: null } });

test('QA-F01 sale product shows sale price, struck original price and discount badge', () => {
  const html = render('src/components/ProductCard.tsx', 'ProductCard', cardState, { product });
  assert.match(html, /900\.000₫/);
  assert.match(html, /1\.000\.000₫/);
  assert.match(html, /-10%/);
  assert.match(html, /Thêm giỏ/);
});

test('QA-F02 ordinary and zero-price products hide the original price and badge', () => {
  const html = render('src/components/ProductCard.tsx', 'ProductCard', cardState, { product: { ...product, price: 0, originalPrice: 0, discountPercent: 0 } });
  assert.match(html, /0₫/);
  assert.doesNotMatch(html, /1\.000\.000₫/);
  assert.doesNotMatch(html, /-\d+%/);
  // Có giá gốc cũ nhưng không còn khuyến mãi thì không được gạch giá.
  const ended = render('src/components/ProductCard.tsx', 'ProductCard', cardState, { product: { ...product, discountPercent: 0 } });
  assert.doesNotMatch(ended, /1\.000\.000₫/);
});

test('QA-F03 sold-out product disables add to cart', () => {
  const html = render('src/components/ProductCard.tsx', 'ProductCard', cardState, { product: { ...product, stock: 0 } });
  assert.match(html, /Hết hàng/);
  assert.doesNotMatch(html, /Thêm giỏ/);
});

test('QA-F04 cart shows loading state before the cart is hydrated', () => {
  const html = render('src/screens/CartScreen.tsx', 'default', { authReady: true, user: { id: 1, role: 'USER' }, cart: null, cartError: '', cartLoading: true, notice: '' });
  assert.match(html, /Đang tải giỏ hàng/);
  assert.doesNotMatch(html, /Giỏ hàng đang trống/);
});

test('QA-F05 empty cart shows the empty state instead of a summary', () => {
  const html = render('src/screens/CartScreen.tsx', 'default', { authReady: true, user: { id: 1, role: 'USER' }, cart: { items: [], itemCount: 0, total: 0 }, cartError: '', cartLoading: false, notice: '' });
  assert.match(html, /Giỏ hàng đang trống/);
  assert.doesNotMatch(html, /Tóm tắt đơn hàng/);
});

test('QA-F06 populated cart lists every item with the item count and total', () => {
  const items = [cartItem(1, 'Nồi cơm điện', 1_200_000, 1), cartItem(2, 'Ấm siêu tốc', 350_000, 2)];
  const html = render('src/screens/CartScreen.tsx', 'default', { authReady: true, user: { id: 1, role: 'USER' }, cart: { items, itemCount: 3, total: 1_900_000 }, cartError: '', cartLoading: false, notice: '' });
  assert.match(html, /Nồi cơm điện/);
  assert.match(html, /Ấm siêu tốc/);
  assert.match(html, /Sản phẩm \(3\)/);
  assert.match(html, /1\.900\.000₫/);
});

test('QA-F07 admin dashboard is only shown to ADMIN; other users see the access check', () => {
  const asUser = render('src/screens/AdminDashboardScreen.tsx', 'default', { authReady: true, user: { id: 2, role: 'USER', fullName: 'Khách' } });
  assert.match(asUser, /Đang xác minh quyền quản trị/);
  assert.doesNotMatch(asUser, /Dashboard/);
  const asAdmin = render('src/screens/AdminDashboardScreen.tsx', 'default', { authReady: true, user: { id: 1, role: 'ADMIN', fullName: 'Quản trị', email: 'admin@shop.com' } });
  assert.match(asAdmin, /Dashboard/);
  assert.doesNotMatch(asAdmin, /Đang xác minh quyền quản trị/);
});
