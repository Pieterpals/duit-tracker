import { getCategoryMeta } from '../data/categories';
import { formatRupiah, formatDate } from '../utils/format';

export default function TransactionItem({ tx, onDelete }) {
  const meta = getCategoryMeta(tx.category);
  const isExpense = tx.type === 'expense';

  return (
    <div className="tx-item">
      <div className="tx-icon" style={{ background: meta.color + '22' }}>
        {meta.icon}
      </div>
      <div className="tx-info">
        <div className="tx-cat">
          {tx.category}
          <span className={`tag ${tx.type}`}>{isExpense ? 'keluar' : 'masuk'}</span>
        </div>
        <div className="tx-note">{tx.note || '—'}</div>
      </div>
      <div className="tx-right">
        <div className={`tx-amount ${tx.type}`}>
          {isExpense ? '-' : '+'}{formatRupiah(tx.amount)}
        </div>
        <div className="tx-date">{formatDate(tx.date)}</div>
      </div>
      <button className="tx-del" onClick={() => onDelete(tx.id)} title="Hapus">🗑</button>
    </div>
  );
}
