import { useState } from 'react';
import { filterByMonth } from '../utils/format';
import TransactionItem from '../components/TransactionItem';

export default function Transactions({ transactions, month, onDelete }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch]         = useState('');

  const monthTxs = filterByMonth(transactions, month);
  const filtered = monthTxs
    .filter((t) => typeFilter === 'all' || t.type === typeFilter)
    .filter((t) => {
      const q = search.toLowerCase();
      return !q || t.category.toLowerCase().includes(q) || (t.note || '').toLowerCase().includes(q);
    });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Semua Transaksi</div>
          <div className="page-date">{filtered.length} transaksi</div>
        </div>
      </div>

      <div className="filter-bar">
        {['all', 'expense', 'income'].map((v) => (
          <button
            key={v}
            className={`filter-btn${typeFilter === v ? ' active' : ''}`}
            onClick={() => setTypeFilter(v)}
          >
            {v === 'all' ? 'Semua' : v === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
          </button>
        ))}
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Cari..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>Tidak ada transaksi yang cocok</p>
        </div>
      ) : (
        <div className="tx-list">
          {filtered.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
