import {
  AreaChart, Area, BarChart, Bar, Cell,
  PieChart, Pie, Tooltip, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import {
  filterByMonth, sumAmount, groupByCategory,
  groupByDay, formatRupiah, formatRupiahShort,
} from '../utils/format';
import { getCategoryMeta } from '../data/categories';
import TransactionItem from '../components/TransactionItem';

function SummaryCard({ label, value, colorClass, sub }) {
  return (
    <div className="sum-card">
      <div className="sum-label">{label}</div>
      <div className={`sum-value ${colorClass}`}>{value}</div>
      {sub && <div className="sum-change">{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, fontSize: 12 }}>
          {p.name}: {formatRupiahShort(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard({ transactions, month, onDelete }) {
  const monthTxs  = filterByMonth(transactions, month);
  const expenses  = monthTxs.filter((t) => t.type === 'expense');
  const incomes   = monthTxs.filter((t) => t.type === 'income');
  const totalExp  = sumAmount(expenses);
  const totalInc  = sumAmount(incomes);
  const net       = totalInc - totalExp;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const dailyAvg  = Math.round(totalExp / daysInMonth);
  const catData   = groupByCategory(expenses);
  const lineData  = groupByDay(transactions, 7);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-date">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-grid">
        <SummaryCard label="💚 Total Pemasukan" value={formatRupiah(totalInc)} colorClass="green" sub={`${incomes.length} transaksi`} />
        <SummaryCard label="❤️ Total Pengeluaran" value={formatRupiah(totalExp)} colorClass="red" sub={`${expenses.length} transaksi`} />
        <SummaryCard
          label="📦 Net Balance"
          value={(net < 0 ? '-' : '') + formatRupiah(Math.abs(net))}
          colorClass={net >= 0 ? 'green' : 'red'}
          sub={net >= 0 ? '🟢 Surplus' : '🔴 Defisit'}
        />
        <SummaryCard label="📅 Rata-rata Harian" value={formatRupiah(dailyAvg)} colorClass="amber" sub="pengeluaran/hari" />
      </div>

      {/* Charts row */}
      <div className="charts-grid">

        {/* Line chart */}
        <div className="chart-card">
          <div className="chart-title">📈 7 Hari Terakhir</div>
          <div className="legend-row">
            <span className="legend-dot green-dot" /> Pemasukan
            <span className="legend-dot red-dot" style={{ marginLeft: 14 }} /> Pengeluaran
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fill: '#8b91a8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8b91a8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatRupiahShort} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income"  name="Pemasukan"   stroke="#34d399" fill="url(#gInc)" strokeWidth={2} dot={{ r: 3, fill: '#34d399' }} />
              <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="#f87171" fill="url(#gExp)" strokeWidth={2} dot={{ r: 3, fill: '#f87171' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="chart-card">
          <div className="chart-title">🍩 Pengeluaran per Kategori</div>
          {catData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>Belum ada pengeluaran</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={catData} dataKey="amount" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {catData.map((entry) => (
                    <Cell key={entry.name} fill={getCategoryMeta(entry.name).color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatRupiah(v)} contentStyle={{ background: '#1e2230', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#8b91a8', fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar chart full width */}
        <div className="chart-card chart-full">
          <div className="chart-title">📊 Pengeluaran per Kategori — {month.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
          {catData.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📭</div><p>Belum ada data</p></div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={Math.max(180, catData.length * 42 + 40)}>
                <BarChart data={catData} layout="vertical" margin={{ left: 0, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#8b91a8', fontSize: 10 }} tickFormatter={formatRupiahShort} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#f0f2f7', fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
                  <Tooltip formatter={(v) => formatRupiah(v)} contentStyle={{ background: '#1e2230', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                    {catData.map((entry) => (
                      <Cell key={entry.name} fill={getCategoryMeta(entry.name).color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Category breakdown pills */}
              <div className="cat-grid">
                {catData.map((c) => {
                  const meta = getCategoryMeta(c.name);
                  const pct  = totalExp ? Math.round((c.amount / totalExp) * 100) : 0;
                  return (
                    <div key={c.name} className="cat-pill">
                      <div className="cat-pill-name">{meta.icon} {c.name}</div>
                      <div className="cat-pill-amount">{formatRupiah(c.amount)}</div>
                      <div className="cat-pill-pct">{pct}% dari total</div>
                      <div className="cat-pill-bar">
                        <div className="cat-pill-fill" style={{ width: `${pct}%`, background: meta.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent */}
      <div className="chart-card">
        <div className="chart-title">🕐 Transaksi Terbaru</div>
        {transactions.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><p>Belum ada transaksi</p></div>
        ) : (
          <div className="tx-list">
            {transactions.slice(0, 5).map((tx) => (
              <TransactionItem key={tx.id} tx={tx} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
