import { useState }         from 'react';
import { ToastProvider }    from './hooks/useToast';
import { useTransactions }  from './hooks/useTransactions';
import Sidebar              from './components/Sidebar';
import Dashboard            from './pages/Dashboard';
import Transactions         from './pages/Transactions';
import AddTransaction       from './pages/AddTransaction';

export default function App() {
  const [page,  setPage]  = useState('dashboard');
  const [month, setMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { transactions, addTransaction, deleteTransaction, clearAll } = useTransactions();

  function handleAdd(tx) {
    addTransaction(tx);
    setPage('dashboard');
  }

  function handleDelete(id) {
    if (!confirm('Hapus transaksi ini?')) return;
    deleteTransaction(id);
  }

  function getPageTitle() {
    if (page === 'dashboard') return 'Dashboard';
    if (page === 'transactions') return 'Transaksi';
    if (page === 'add') return 'Tambah Entri';
    return 'DuitTracker';
  }

  return (
    <ToastProvider>
      <div className="app">
        <Sidebar
          page={page}
          setPage={(p) => { setPage(p); setSidebarOpen(false); }}
          transactions={transactions}
          clearAll={clearAll}
          month={month}
          setMonth={setMonth}
          isOpen={sidebarOpen}
        />
        
        {/* Overlay for mobile sidebar */}
        <div 
          className={`overlay ${sidebarOpen ? 'open' : ''}`} 
          onClick={() => setSidebarOpen(false)}
        />

        <main className="main">
          {/* Mobile Header */}
          <div className="mobile-header">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
            <div className="mobile-header-title">{getPageTitle()}</div>
            <div style={{ width: 24 }}></div> {/* Spacer for balance */}
          </div>

          <div>
            {page === 'dashboard'    && <Dashboard    transactions={transactions} month={month} onDelete={handleDelete} setPage={setPage} />}
            {page === 'transactions' && <Transactions transactions={transactions} month={month} onDelete={handleDelete} />}
            {page === 'add'          && <AddTransaction onAdd={handleAdd} />}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}