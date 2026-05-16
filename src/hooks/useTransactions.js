import { useState, useCallback, useEffect } from 'react';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all transactions from the API
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch('/api/transactions');
        if (!res.ok) throw new Error('Failed to fetch transactions');
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTransactions();
  }, []);

  const addTransaction = useCallback(async (tx) => {
    try {
      // Optimistic UI update
      const tempId = Date.now().toString();
      const optimisticTx = { ...tx, id: tempId, created_at: new Date().toISOString() };
      setTransactions((prev) => [optimisticTx, ...prev]);

      // Real API call
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      });
      
      if (!res.ok) throw new Error('Failed to save transaction');
      
      const savedTx = await res.json();
      
      // Replace the optimistic temp transaction with the real one from DB
      setTransactions((prev) => prev.map(t => t.id === tempId ? savedTx : t));
      return savedTx;
    } catch (error) {
      console.error("Error saving transaction:", error);
      setTransactions((prev) => prev.filter(t => t.id !== tx.id));
      alert("Gagal menyimpan ke database. Coba lagi.");
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      // Optimistic delete
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete transaction');
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Gagal menghapus dari database. Coba muat ulang halaman.");
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      setTransactions([]);
      const res = await fetch('/api/transactions', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to clear transactions');
    } catch (error) {
      console.error("Error clearing transactions:", error);
      alert("Gagal menghapus semua data. Coba muat ulang halaman.");
    }
  }, []);

  return { transactions, isLoading, addTransaction, deleteTransaction, clearAll };
}