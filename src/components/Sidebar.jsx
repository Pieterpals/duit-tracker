import { filterByMonth, sumAmount, formatRupiah, exportToCSV } from '../utils/format';
import { useToast } from '../hooks/useToast';

const NAV = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard'    },
  { id: 'transactions', icon: '📋', label: 'Transaksi'    },
  { id: 'add',          icon: '➕', label: 'Tambah Entri'  },
];

export default function Sidebar({ page, setPage, transactions, clearAll, month, setMonth }) {
  const showToast = useToast();
  const monthTxs  = filterByMonth(transactions, month);
  const income    = sumAmount(monthTxs.filter((t) => t.type === 'income'));
  const expense   = sumAmount(monthTxs.filter((t) => t.type === 'expense'));
  const net       = income - expense;

  function changeMonth(dir) {
    setMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
  }

  function handleExport() {
    if (!transactions.length) { showToast('Tidak ada data', 'error'); return; }
    exportToCSV(transactions);
    showToast('✅ CSV berhasil diexport!');
  }

  function handleClear() {
    if (!confirm('Hapus SEMUA transaksi? Tidak bisa dibatalkan.')) return;
    clearAll();
    showToast('🗑 Semua data dihapus', 'error');
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">💰</div>
        <div>
          <div className="logo-text">DuitTracker</div>
          <div className="logo-sub">Andrea &amp; Ricky</div>
        </div>
      </div>

      {/* Balance card */}
      <div className="balance-card">
        <div className="balance-label">Saldo Bulan Ini</div>
        <div className="balance-amount">{(net < 0 ? '-' : '') + formatRupiah(Math.abs(net))}</div>
        <div className="balance-sub">{net >= 0 ? '↑ Surplus' : '↓ Defisit'} bulan ini</div>
      </div>

      {/* Nav */}
      <div className="nav-label">Menu</div>
      {NAV.map((n) => (
        <button
          key={n.id}
          className={`nav-item${page === n.id ? ' active' : ''}`}
          onClick={() => setPage(n.id)}
        >
          <span className="nav-icon">{n.icon}</span> {n.label}
        </button>
      ))}

      {/* Month nav */}
      <div className="nav-label" style={{ marginTop: 8 }}>Filter Bulan</div>
      <div className="month-nav">
        <button onClick={() => changeMonth(-1)}>‹</button>
        <div className="month-display">
          {month.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={() => changeMonth(1)}>›</button>
      </div>

      {/* Actions */}
      <div className="sidebar-footer">
        <button className="nav-item teal" onClick={handleExport}>
          <span className="nav-icon">⬇</span> Export CSV
        </button>
        <button className="nav-item danger" onClick={handleClear}>
          <span className="nav-icon">🗑</span> Hapus Semua
        </button>
      </div>
    </aside>
  );
}
