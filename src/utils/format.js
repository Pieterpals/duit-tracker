export function formatRupiah(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function formatRupiahShort(n) {
  if (n >= 1_000_000_000) return 'Rp ' + (n / 1_000_000_000).toFixed(1) + 'M';
  if (n >= 1_000_000)     return 'Rp ' + (n / 1_000_000).toFixed(1) + 'jt';
  if (n >= 1_000)         return 'Rp ' + (n / 1_000).toFixed(0) + 'rb';
  return 'Rp ' + n;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function isSameMonth(dateStr, refDate) {
  const d = new Date(dateStr);
  return d.getFullYear() === refDate.getFullYear() && d.getMonth() === refDate.getMonth();
}

export function filterByMonth(transactions, month) {
  return transactions.filter((t) => isSameMonth(t.date, month));
}

export function sumAmount(txs) {
  return txs.reduce((s, t) => s + t.amount, 0);
}

export function groupByCategory(txs) {
  const map = {};
  txs.forEach((t) => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({ name, amount }));
}

export function groupByDay(txs, days = 7) {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    const dayTxs = txs.filter((t) => t.date === ds);
    result.push({
      label,
      income:  sumAmount(dayTxs.filter((t) => t.type === 'income')),
      expense: sumAmount(dayTxs.filter((t) => t.type === 'expense')),
    });
  }
  return result;
}

export function exportToCSV(transactions) {
  const rows = [['Tanggal', 'Pengguna', 'Tipe', 'Kategori', 'Jumlah', 'Catatan']];
  transactions.forEach((t) =>
    rows.push([t.date, t.user_id || '-', t.type, t.category, t.amount, t.note || ''])
  );
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `duittracker_${todayISO()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function filterByUser(transactions, userId) {
  if (!userId || userId === 'all') return transactions;
  return transactions.filter((t) => t.user_id === userId);
}

export function groupByCategoryForUsers(transactions, month) {
  const monthTxs = filterByMonth(transactions, month).filter(t => t.type === 'expense');
  const catMap = {};

  monthTxs.forEach((t) => {
    if (!catMap[t.category]) catMap[t.category] = { category: t.category, ricky: 0, andrea: 0 };
    if (t.user_id === 'ricky') catMap[t.category].ricky += t.amount;
    else if (t.user_id === 'andrea') catMap[t.category].andrea += t.amount;
  });

  return Object.values(catMap).sort((a, b) => (b.ricky + b.andrea) - (a.ricky + a.andrea));
}

export function getMonthLabel(date) {
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

export function groupByDayForMonth(transactions, month) {
  const year = month.getFullYear();
  const m = month.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const result = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const ds = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const label = `${day}`;
    const dayTxs = transactions.filter((t) => t.date === ds);
    result.push({
      label,
      expense: sumAmount(dayTxs.filter((t) => t.type === 'expense')),
      income: sumAmount(dayTxs.filter((t) => t.type === 'income')),
    });
  }
  return result;
}

