import { useState } from 'react';
import { filterByMonth, exportToCSV } from '../utils/format';
import TransactionItem from '../components/TransactionItem';

export default function Transactions({ transactions, allTransactions, month, onDelete, userFilter, setUserFilter }) {
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
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div>
          <div className="page-title">Semua Transaksi</div>
          <div className="page-date">{filtered.length} transaksi</div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select 
            className="form-select" 
            value={userFilter} 
            onChange={(e) => setUserFilter(e.target.value)}
            style={{ width: '160px', padding: '8px 12px', fontSize: '13px' }}
          >
            <option value="all">Semua Pengguna</option>
            <option value="ricky">Ricky</option>
            <option value="andrea">Andrea</option>
          </select>

          <button 
            className="btn-add" 
            style={{ background: 'var(--teal)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => {
              if (!allTransactions.length) return alert('Tidak ada data');
              exportToCSV(allTransactions);
            }}
          >
            ⬇ Export Semua
          </button>
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
