import assert from 'node:assert/strict';
import { adminBarHeight, adminDayLabel, compactAdminMoney, fillAdminWeek, shiftAdminDay } from '../src/adminDashboard.mjs';

assert.equal(shiftAdminDay('2026-03-01', -1), '2026-02-28');
assert.equal(shiftAdminDay('2026-11-01', -7), '2026-10-25');
const week = fillAdminWeek([{ day: '2026-11-06', value: '3' }], '2026-11-08');
assert.deepEqual(week.map(row => row.day), ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08']);
assert.deepEqual(week.map(row => row.value), [0, 0, 0, 0, 3, 0, 0]);

assert.equal(adminDayLabel('2026-10-30'), '30/10');
assert.equal(adminDayLabel('2026-10-30T00:00:00.000Z'), '30/10');
assert.equal(adminDayLabel('không rõ'), 'không rõ');
assert.equal(adminBarHeight(50, 100), 56);
assert.equal(adminBarHeight(0, 0), 4);
assert.equal(adminBarHeight(-10, 100), 4);
assert.equal(compactAdminMoney(950), '950');
assert.equal(compactAdminMoney(12_500), '13k');
assert.equal(compactAdminMoney(2_500_000), '2.5tr');

console.log('Admin dashboard checks passed.');
