export function adminDayLabel(value) {
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value || ''));
  if (iso) return `${iso[3]}/${iso[2]}`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || '—');
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function adminBarHeight(value, maxValue, height = 112) {
  const safeValue = Math.max(0, Number(value) || 0);
  const safeMax = Math.max(0, Number(maxValue) || 0);
  return safeMax ? Math.max(4, Math.round((safeValue / safeMax) * height)) : 4;
}

export function adminIsoDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function shiftAdminDay(iso, days) {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return adminIsoDay(date);
}

// Đủ 7 ngày kết thúc ở `end`; ngày không có đơn hiển thị 0.
export function fillAdminWeek(rows, end) {
  const byDay = new Map((rows ?? []).map(row => [adminDayLabel(row.day), Number(row.value) || 0]));
  return Array.from({ length: 7 }, (_, index) => {
    const day = shiftAdminDay(end, index - 6);
    return { day, value: byDay.get(adminDayLabel(day)) ?? 0 };
  });
}

export function compactAdminMoney(value) {
  const amount = Number(value) || 0;
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}tỷ`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}tr`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)}k`;
  return String(amount);
}
