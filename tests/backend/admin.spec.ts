// file kiểm thử các chức năng quản trị: liên hệ, voucher tri ân, dashboard, doanh thu, sản phẩm, người dùng, mã giảm giá.
import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AdminService } from '../../backend/src/admin/admin.service';
import { ContactService } from '../../backend/src/contact/contact.service';
import { CouponsService } from '../../backend/src/coupon/coupons.service';
import { Coupon } from '../../backend/src/database/entities/coupon.entity';
import { OrderStatus, PaymentMethod, PaymentRecordStatus, PaymentStatus } from '../../backend/src/database/entities/enums';
import { OrdersService } from '../../backend/src/orders/orders.service';
import { ProductsService } from '../../backend/src/products/products.service';

// Repository giả dùng chung: lưu dòng trong mảng, đủ các hàm mà service gọi.
function memoryRepo(rows: any[] = []) {
  let next = rows.length + 1;
  const match = (row: any, where: any) => Object.entries(where ?? {}).every(([k, v]) => row[k] === v);
  return {
    rows,
    create: (data: any) => ({ ...data }),
    save: async (row: any) => { if (!row.id) { row.id = next++; rows.push(row); } return row; },
    find: async (options: any = {}) => rows.filter(r => match(r, options.where)),
    findOne: async ({ where }: any) => rows.find(r => match(r, where)) ?? null,
    findOneBy: async (where: any) => rows.find(r => match(r, where)) ?? null,
    exists: async ({ where }: any) => rows.some(r => match(r, where)),
    remove: async (row: any) => { rows.splice(rows.indexOf(row), 1); return row; },
  };
}

test('QA-C01 contact message is stored unread; admin marks read, deletes, and gets 404 for unknown ids (US06, US33)', async () => {
  const repo = memoryRepo();
  const service = new ContactService(repo as never);
  const saved = await service.create({ name: 'Lan', email: 'lan@example.com', message: 'Tư vấn nồi chiên' } as never);
  assert.equal(saved.isRead, false); assert.equal(saved.phone, null);
  assert.equal((await service.adminList()).length, 1);
  assert.equal((await service.markRead(saved.id)).isRead, true);
  await assert.rejects(service.markRead(999), NotFoundException);
  assert.deepEqual(await service.remove(saved.id), { message: 'Đã xóa tin nhắn' });
  assert.equal(repo.rows.length, 0);
  await assert.rejects(service.remove(saved.id), NotFoundException);
});

test('QA-C02 admin user list never exposes password, PIN hash or card data (US30)', async () => {
  const users = memoryRepo([{ id: 1, fullName: 'An', username: 'an', email: 'an@x.vn', phone: '090', role: 'USER',
    password: '$2a$10$hash', transactionPinHash: '$2a$10$pin', cardLast4: '4242', createdAt: new Date() }]);
  const result = await new AdminService(users as never, {} as never).usersList();
  assert.deepEqual(Object.keys(result[0]).sort(), ['createdAt', 'email', 'fullName', 'id', 'phone', 'role', 'username']);
});

// OrdersService với repository giả; chỉ các repo mà phương thức được kiểm thử dùng tới.
function ordersService(order: any, coupons = memoryRepo(), payments = memoryRepo()) {
  const orders = memoryRepo(order ? [order] : []);
  const source = { getRepository: (entity: unknown) => { assert.equal(entity, Coupon); return coupons; } };
  const service = new OrdersService(source as never, orders as never, {} as never, {} as never, {} as never, {} as never, payments as never, {} as never, {} as never);
  return { service, coupons, payments };
}

test('QA-C03 confirming an order of 1–5 million grants one DON voucher of 10–20% for 90 days (US25)', async () => {
  const { service, coupons } = ordersService({ id: 7, userId: 3, status: OrderStatus.PENDING, subtotalAmount: '2000000', totalAmount: '2000000', paymentMethod: PaymentMethod.PAYOS });
  await service.adminUpdateStatus(7, { status: OrderStatus.CONFIRMED });
  assert.equal(coupons.rows.length, 1);
  const [coupon] = coupons.rows;
  assert.equal(coupon.code, 'DON7'); assert.equal(coupon.userId, 3); assert.equal(coupon.usageLimit, 1);
  assert.ok(coupon.discountValue >= 10 && coupon.discountValue <= 20);
  assert.equal(Math.round((coupon.endDate - coupon.startDate) / 86_400_000), 90);
  // Xác nhận lại không tạo thêm mã.
  await service.adminUpdateStatus(7, { status: OrderStatus.PENDING });
  await service.adminUpdateStatus(7, { status: OrderStatus.CONFIRMED });
  assert.equal(coupons.rows.length, 1);
});

test('QA-C04 orders from 5 million get 30–40%; orders under 1 million get no voucher (US25)', async () => {
  const big = ordersService({ id: 8, userId: 3, status: OrderStatus.PENDING, subtotalAmount: '6000000', totalAmount: '6000000' });
  await big.service.adminUpdateStatus(8, { status: OrderStatus.CONFIRMED });
  assert.ok(big.coupons.rows[0].discountValue >= 30 && big.coupons.rows[0].discountValue <= 40);
  const small = ordersService({ id: 9, userId: 3, status: OrderStatus.PENDING, subtotalAmount: '900000', totalAmount: '900000' });
  await small.service.adminUpdateStatus(9, { status: OrderStatus.CONFIRMED });
  assert.equal(small.coupons.rows.length, 0);
  await assert.rejects(small.service.adminUpdateStatus(404, { status: OrderStatus.CONFIRMED }), NotFoundException);
});

test('QA-C05 delivering a COD order marks the order and its payment as paid (US29)', async () => {
  const payments = memoryRepo([{ id: 1, orderId: 5, status: PaymentRecordStatus.PENDING, paidAt: null }]);
  const { service } = ordersService({ id: 5, userId: 1, status: OrderStatus.CONFIRMED, subtotalAmount: '500000', totalAmount: '500000',
    paymentMethod: PaymentMethod.CASH, paymentStatus: PaymentStatus.UNPAID }, memoryRepo(), payments);
  const result = await service.adminUpdateStatus(5, { status: OrderStatus.DELIVERED });
  assert.equal(result.paymentStatus, PaymentStatus.PAID);
  assert.equal(payments.rows[0].status, PaymentRecordStatus.SUCCESS); assert.ok(payments.rows[0].paidAt instanceof Date);
});

// QueryBuilder giả ghi lại điều kiện WHERE và trả kết quả định sẵn.
function recordingQuery(raw: any, log: string[]) {
  const q: any = {};
  for (const name of ['select', 'addSelect', 'groupBy', 'orderBy']) q[name] = () => q;
  q.where = (sql: string, params: any) => { log.push(sql + ' ' + JSON.stringify(params)); return q; };
  q.andWhere = (sql: string) => { log.push(sql); return q; };
  q.getRawOne = async () => raw; q.getRawMany = async () => raw;
  return q;
}

test('QA-C06 dashboard excludes cancelled orders and returns numeric totals (US27)', async () => {
  const log: string[] = [];
  const raws = [{ revenue: '3500000' }, [{ day: '2026-10-30', value: '1500000' }], [{ day: '2026-10-30', value: '2' }]];
  const counts: any[] = [];
  const orders = {
    createQueryBuilder: () => recordingQuery(raws.shift(), log),
    count: async (options: any) => { counts.push(options); return options?.where?.status === OrderStatus.PENDING ? 1 : 4; },
    find: async () => [],
  };
  const service = new OrdersService({} as never, orders as never, { count: async () => 12 } as never, {} as never, {} as never, {} as never, {} as never, { count: async () => 5 } as never, {} as never);
  const result = await service.dashboardSummary();
  assert.equal(result.revenue, 3_500_000); assert.equal(result.orders, 4); assert.equal(result.pendingOrders, 1);
  assert.equal(result.users, 5); assert.equal(result.products, 12);
  assert.deepEqual(result.chartRevenueByDay, [{ day: '2026-10-30', value: 1_500_000 }]);
  assert.deepEqual(result.chartOrdersByDay, [{ day: '2026-10-30', value: 2 }]);
  const cancelledFilters = log.filter(l => l.includes('status != :cancelled'));
  assert.equal(cancelledFilters.length, 3);
  assert.ok(cancelledFilters.every(l => l.includes('"CANCELLED"')));
  assert.equal(counts[0].where.status._type, 'not');
});

test('QA-C06b dashboard chart can end on an older date and rejects malformed dates', async () => {
  const params: any[] = []; const sqls: string[] = [];
  const q: any = {};
  for (const name of ['select', 'addSelect', 'groupBy', 'orderBy', 'where']) q[name] = () => q;
  q.andWhere = (sql: string, p: any) => { sqls.push(sql); params.push(p); return q; };
  q.getRawOne = async () => ({ revenue: '0' }); q.getRawMany = async () => [];
  const orders = { createQueryBuilder: () => q, count: async () => 0, find: async () => [] };
  const service = new OrdersService({} as never, orders as never, { count: async () => 0 } as never, {} as never, {} as never, {} as never, {} as never, { count: async () => 0 } as never, {} as never);
  await service.dashboardSummary('2026-01-15');
  assert.equal(sqls.length, 2);
  assert.ok(sqls.every(s => s.includes('DATE(:end)') && !s.includes('CURDATE()')));
  assert.ok(params.every(p => p.end === '2026-01-15'));
  await assert.rejects(service.dashboardSummary('15/01/2026'), BadRequestException);
});

test('QA-C07 monthly revenue groups non-cancelled orders and converts strings to numbers (US34)', async () => {
  const log: string[] = [];
  const orders = { createQueryBuilder: () => recordingQuery([{ period: '2026-10', orders: '17', revenue: '36725000' }], log) };
  const service = new OrdersService({} as never, orders as never, {} as never, {} as never, {} as never, {} as never, {} as never, {} as never, {} as never);
  assert.deepEqual(await service.revenueSummary(), [{ period: '2026-10', orders: 17, revenue: 36_725_000 }]);
  assert.match(log[0], /status != :cancelled.*CANCELLED/);
});

test('QA-C08 admin product create, partial update, image replacement and delete (US28)', async () => {
  const query: any = { select: () => query, addSelect: () => query, where: () => query, groupBy: () => query, getRawMany: async () => [] };
  const repo: any = memoryRepo();
  repo.manager = { getRepository: () => ({ createQueryBuilder: () => query }) };
  const service = new ProductsService(repo, { prices: async () => new Map() } as never);
  const created = await service.create({ name: 'Nồi chiên 5L', price: 1_590_000, stock: 8 } as never, '/uploads/products/a.webp');
  assert.equal(created.imageUrl, '/uploads/products/a.webp'); assert.equal(repo.rows[0].price, '1590000'); assert.equal(created.isFeatured, false);
  await service.update(created.id, { stock: 3 } as never);
  assert.equal(repo.rows[0].stock, 3); assert.equal(repo.rows[0].name, 'Nồi chiên 5L');
  await service.update(created.id, {} as never, '/uploads/products/b.webp');
  assert.equal(repo.rows[0].imageUrl, '/uploads/products/b.webp');
  await assert.rejects(service.update(999, { stock: 1 } as never), NotFoundException);
  assert.deepEqual(await service.remove(created.id), { message: 'Đã xóa sản phẩm' });
  await assert.rejects(service.remove(created.id), NotFoundException);
});

test('QA-C09 admin coupon codes are uppercased, unique on create and update, and 404 when missing (US31)', async () => {
  const repo = memoryRepo();
  const service = new CouponsService(repo as never, {} as never);
  const first = await service.create({ code: ' giam10 ', discountValue: 10 } as never);
  assert.equal(first.code, 'GIAM10');
  await assert.rejects(service.create({ code: 'Giam10' } as never), BadRequestException);
  await assert.rejects(service.create({} as never), BadRequestException);
  const second = await service.create({ code: 'sale20' } as never);
  await assert.rejects(service.update(second.id, { code: 'giam10' } as never), BadRequestException);
  assert.equal((await service.update(second.id, { code: 'sale25' } as never)).code, 'SALE25');
  assert.equal((await service.findAllAdmin()).length, 2);
  await service.remove(first.id);
  await assert.rejects(service.findOne(first.id), NotFoundException);
});
