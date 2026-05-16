import { useState, useCallback } from 'react';

const STORAGE_KEY = 'duit_transactions';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function save(txs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
}

export function useTransactions() {
  const [transactions, setTransactions] = useState(load);

  const addTransaction = useCallback((tx) => {
    const newTx = { ...tx, id: Date.now(), createdAt: new Date().toISOString() };
    setTransactions((prev) => {
      const next = [newTx, ...prev];
      save(next);
      return next;
    });
    return newTx;
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => {
      const next = prev.filter((t) => t.id !== id);
      save(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setTransactions([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { transactions, addTransaction, deleteTransaction, clearAll };
}
