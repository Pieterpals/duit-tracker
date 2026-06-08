import { useState, useMemo } from 'react';
import { formatRupiah, formatDate } from '../utils/format';
import { getCategoryMeta, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';
import { useToast } from '../hooks/useToast';

const PAGE_SIZE = 15;

export default function AllTransactions({ transactions, onDelete, onUpdate, userFilter, setUserFilter }) {
  const showToast = useToast();
  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy]         = useState('created_at');
  const [sortDir, setSortDir]       = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId]   = useState(null);
  const [editForm, setEditForm]     = useState({});

  // Filter + Sort
  const filtered = useMemo(() => {
    let result = transactions
      .filter((t) => typeFilter === 'all' || t.type === typeFilter)
      .filter((t) => {
        const q = search.toLowerCase();
        return !q || t.category.toLowerCase().includes(q) || (t.note || '').toLowerCase().includes(q)
          || (t.user_id || '').toLowerCase().includes(q);
      });

    result = [...result].sort((a, b) => {
      let valA, valB;
      if (sortBy === 'amount') {
        return sortDir === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      valA = a[sortBy] || '';
      valB = b[sortBy] || '';
      if (sortDir === 'asc') return valA < valB ? -1 : valA > valB ? 1 : 0;
      return valA > valB ? -1 : valA < valB ? 1 : 0;
    });

    return result;
  }, [transactions, typeFilter, search, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  function handleSort(col) {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  }

  function sortIcon(col) {
    if (sortBy !== col) return <span className="sort-indicator">⇅</span>;
    return <span className="sort-indicator active">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  function startEdit(tx) {
    setEditingId(tx.id);
    setEditForm({
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      date: tx.date,
      note: tx.note || '',
      user_id: tx.user_id || 'unknown',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function saveEdit(id) {
    const amt = parseFloat(editForm.amount);
    if (!amt || amt <= 0) { showToast('⚠️ Jumlah harus lebih dari 0', 'error'); return; }
    if (!editForm.category) { showToast('⚠️ Pilih kategori', 'error'); return; }

    await onUpdate(id, { ...editForm, amount: amt });
    showToast('✅ Transaksi berhasil diubah!');
    setEditingId(null);
    setEditForm({});
  }

  function handleEditKeyDown(e, id) {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') cancelEdit();
  }

  const categories = editForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Page numbers to show
  function getPageNumbers() {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, safeCurrentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    if (start > 1) { pages.push(1); if (start > 2) pages.push('...'); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push('...'); pages.push(totalPages); }

    return pages;
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div>
          <div className="page-title">📑 Semua Data</div>
          <div className="page-date">{filtered.length} transaksi · Halaman {safeCurrentPage} dari {totalPages}</div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            value={userFilter}
            onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
            style={{ width: '160px', padding: '8px 12px', fontSize: '13px' }}
          >
            <option value="all">Semua Pengguna</option>
            <option value="ricky">Ricky</option>
            <option value="andrea">Andrea</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        {['all', 'expense', 'income'].map((v) => (
          <button
            key={v}
            className={`filter-btn${typeFilter === v ? ' active' : ''}`}
            onClick={() => { setTypeFilter(v); setCurrentPage(1); }}
          >
            {v === 'all' ? 'Semua' : v === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
          </button>
        ))}
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Cari kategori, catatan, user..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table" id="all-transactions-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')} className="sortable-th">
                Tanggal {sortIcon('date')}
              </th>
              <th onClick={() => handleSort('user_id')} className="sortable-th">
                User {sortIcon('user_id')}
              </th>
              <th onClick={() => handleSort('type')} className="sortable-th">
                Tipe {sortIcon('type')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable-th">
                Kategori {sortIcon('category')}
              </th>
              <th onClick={() => handleSort('amount')} className="sortable-th">
                Jumlah {sortIcon('amount')}
              </th>
              <th>Catatan</th>
              <th onClick={() => handleSort('created_at')} className="sortable-th">
                Dibuat {sortIcon('created_at')}
              </th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-table-cell">
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>Tidak ada data yang cocok</p>
                  </div>
                </td>
              </tr>
            ) : paginated.map((tx) => (
              editingId === tx.id ? (
                /* Edit row */
                <tr key={tx.id} className="edit-row" onKeyDown={(e) => handleEditKeyDown(e, tx.id)}>
                  <td>
                    <input
                      className="table-input"
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm(f => ({ ...f, date: e.target.value }))}
                    />
                  </td>
                  <td>
                    <select
                      className="table-select"
                      value={editForm.user_id}
                      onChange={(e) => setEditForm(f => ({ ...f, user_id: e.target.value }))}
                    >
                      <option value="ricky">Ricky</option>
                      <option value="andrea">Andrea</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="table-select"
                      value={editForm.type}
                      onChange={(e) => setEditForm(f => ({ ...f, type: e.target.value, category: '' }))}
                    >
                      <option value="expense">Pengeluaran</option>
                      <option value="income">Pemasukan</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="table-select"
                      value={editForm.category}
                      onChange={(e) => setEditForm(f => ({ ...f, category: e.target.value }))}
                    >
                      <option value="">— Pilih —</option>
                      {categories.map((c) => (
                        <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      className="table-input"
                      type="number"
                      value={editForm.amount}
                      min={0}
                      onChange={(e) => setEditForm(f => ({ ...f, amount: e.target.value }))}
                    />
                  </td>
                  <td>
                    <input
                      className="table-input"
                      type="text"
                      value={editForm.note}
                      placeholder="Catatan..."
                      onChange={(e) => setEditForm(f => ({ ...f, note: e.target.value }))}
                    />
                  </td>
                  <td className="text-muted">
                    {tx.created_at ? formatDate(tx.created_at) : '—'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-btn save" onClick={() => saveEdit(tx.id)} title="Simpan (Enter)">✓</button>
                      <button className="table-btn cancel" onClick={cancelEdit} title="Batal (Esc)">✕</button>
                    </div>
                  </td>
                </tr>
              ) : (
                /* View row */
                <tr key={tx.id}>
                  <td className="text-mono">{formatDate(tx.date)}</td>
                  <td>
                    <span className="user-badge" style={{
                      background: tx.user_id === 'andrea' ? 'rgba(244,114,182,0.15)' : 'rgba(108,99,255,0.15)',
                      color: tx.user_id === 'andrea' ? 'var(--pink)' : 'var(--accent2)',
                    }}>
                      {tx.user_id === 'andrea' ? 'Andrea' : 'Ricky'}
                    </span>
                  </td>
                  <td>
                    <span className={`tag ${tx.type}`}>
                      {tx.type === 'expense' ? 'Keluar' : 'Masuk'}
                    </span>
                  </td>
                  <td>
                    <span className="category-cell">
                      {getCategoryMeta(tx.category).icon} {tx.category}
                    </span>
                  </td>
                  <td className={`text-mono ${tx.type === 'expense' ? 'text-red' : 'text-green'}`}>
                    {tx.type === 'expense' ? '-' : '+'}{formatRupiah(tx.amount)}
                  </td>
                  <td className="text-muted text-ellipsis">{tx.note || '—'}</td>
                  <td className="text-muted text-mono text-sm">
                    {tx.created_at ? formatDate(tx.created_at) : '—'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-btn edit" onClick={() => startEdit(tx)} title="Edit">✏️</button>
                      <button className="table-btn delete" onClick={() => onDelete(tx.id)} title="Hapus">🗑</button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            ‹ Prev
          </button>

          {getPageNumbers().map((p, i) =>
            p === '...' ? (
              <span key={`dots-${i}`} className="pagination-dots">…</span>
            ) : (
              <button
                key={p}
                className={`pagination-btn${p === safeCurrentPage ? ' active' : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            )
          )}

          <button
            className="pagination-btn"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
