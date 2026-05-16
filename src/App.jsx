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
  const { transactions, addTransaction, deleteTransaction, clearAll } = useTransactions();

  function handleAdd(tx) {
    addTransaction(tx);
    setPage('dashboard');
  }

  function handleDelete(id) {
    if (!confirm('Hapus transaksi ini?')) return;
    deleteTransaction(id);
  }

  return (
    <ToastProvider>
      <div className="app">
        <Sidebar
          page={page}
          setPage={setPage}
          transactions={transactions}
          clearAll={clearAll}
          month={month}
          setMonth={setMonth}
        />
        <main className="main">
          {page === 'dashboard'    && <Dashboard    transactions={transactions} month={month} onDelete={handleDelete} />}
          {page === 'transactions' && <Transactions transactions={transactions} month={month} onDelete={handleDelete} />}
          {page === 'add'          && <AddTransaction onAdd={handleAdd} />}
        </main>
      </div>
    </ToastProvider>
  );
}
