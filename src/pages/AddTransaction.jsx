import { useState } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, QUICK_ENTRIES } from '../data/categories';
import { todayISO } from '../utils/format';
import { useToast } from '../hooks/useToast';

export default function AddTransaction({ onAdd }) {
  const showToast = useToast();
  const [type,     setType]     = useState('expense');
  const [amount,   setAmount]   = useState('');
  const [category, setCategory] = useState('');
  const [date,     setDate]     = useState(todayISO());
  const [note,     setNote]     = useState('');

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function handleSubmit(e) {
    e?.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0)   { showToast('⚠️ Masukkan jumlah yang valid', 'error'); return; }
    if (!category)          { showToast('⚠️ Pilih kategori', 'error');             return; }

    onAdd({ type, amount: amt, category, date: date || todayISO(), note: note.trim() });

    setAmount('');
    setCategory('');
    setDate(todayISO());
    setNote('');
    showToast('✅ Transaksi ditambahkan!');
  }

  function applyQuick(q) {
    setType('expense');
    setCategory(q.category);
    if (q.amount) setAmount(String(q.amount));
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tambah Transaksi</div>
          <div className="page-date">Ctrl + Enter untuk menyimpan</div>
        </div>
      </div>

      <div className="form-card" style={{ maxWidth: 680 }}>
        <div className="form-title">✏️ Entri Baru</div>

        {/* Type toggle */}
        <div style={{ marginBottom: 16 }}>
          <div className="form-label" style={{ marginBottom: 8 }}>Tipe</div>
          <div className="type-toggle">
            <button
              className={`type-btn${type === 'expense' ? ' active expense' : ''}`}
              onClick={() => { setType('expense'); setCategory(''); }}
            >💸 Pengeluaran</button>
            <button
              className={`type-btn${type === 'income' ? ' active income' : ''}`}
              onClick={() => { setType('income'); setCategory(''); }}
            >💵 Pemasukan</button>
          </div>
        </div>

        <form onKeyDown={(e) => { if (e.ctrlKey && e.key === 'Enter') handleSubmit(); }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Jumlah (Rp)</label>
              <input
                className="form-input"
                type="number"
                placeholder="50000"
                min={0}
                step={1000}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">— Pilih —</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal (kosong = hari ini)</label>
              <input
                className="form-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <button type="button" className="btn-add" onClick={handleSubmit}>
              ➕ Tambah
            </button>
          </div>

          <div className="form-group" style={{ marginTop: 12 }}>
            <label className="form-label">Catatan (opsional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="mis: makan siang bareng Ricky"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Quick entries */}
      <div className="form-card" style={{ maxWidth: 680 }}>
        <div className="form-title">⚡ Entri Cepat (Pengeluaran)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {QUICK_ENTRIES.map((q) => (
            <button key={q.label} className="filter-btn" onClick={() => applyQuick(q)}>
              {q.label}{q.amount ? ` · Rp ${(q.amount / 1000).toFixed(0)}rb` : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
