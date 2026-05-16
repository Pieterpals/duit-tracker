export const EXPENSE_CATEGORIES = [
  { name: 'Makan & Minum',     icon: '🍱', color: '#f87171' },
  { name: 'Transport',         icon: '🚗', color: '#fbbf24' },
  { name: 'Kopi',              icon: '☕', color: '#a78bfa' },
  { name: 'Belanja (Shopee)',  icon: '🛍️', color: '#f472b6' },
  { name: 'Listrik & PDAM',   icon: '⚡', color: '#22d3ee' },
  { name: 'Pulsa & Internet',  icon: '📱', color: '#34d399' },
  { name: 'Untuk Orang Tua',  icon: '👨‍👩‍👧', color: '#fbbf24' },
  { name: 'Persembahan',       icon: '🙏', color: '#6c63ff' },
  { name: 'Asuransi',         icon: '🛡️', color: '#22d3ee' },
  { name: 'Apartemen/Kost',   icon: '🏠', color: '#34d399' },
  { name: 'Kesehatan',        icon: '💊', color: '#f87171' },
  { name: 'Olahraga',         icon: '🏋️', color: '#34d399' },
  { name: 'Kado',             icon: '🎁', color: '#f472b6' },
  { name: 'Hiburan',          icon: '🎬', color: '#a78bfa' },
  { name: 'Lainnya',          icon: '📦', color: '#8b91a8' },
];

export const INCOME_CATEGORIES = [
  { name: 'Gaji',       icon: '💼', color: '#34d399' },
  { name: 'Bonus & THR', icon: '🎉', color: '#fbbf24' },
  { name: 'Hadiah',     icon: '🎁', color: '#f472b6' },
  { name: 'Freelance',  icon: '💻', color: '#22d3ee' },
  { name: 'Lainnya',    icon: '💰', color: '#8b91a8' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const QUICK_ENTRIES = [
  { label: 'Kopi',        category: 'Kopi',             amount: 35000  },
  { label: 'Makan Siang', category: 'Makan & Minum',    amount: 50000  },
  { label: 'Bensin',      category: 'Transport',         amount: 100000 },
  { label: 'Shopee',      category: 'Belanja (Shopee)',  amount: 0      },
  { label: 'Pulsa',       category: 'Pulsa & Internet',  amount: 100000 },
  { label: 'Persembahan', category: 'Persembahan',       amount: 200000 },
];

export function getCategoryMeta(name) {
  return ALL_CATEGORIES.find((c) => c.name === name) || { icon: '📦', color: '#8b91a8' };
}
