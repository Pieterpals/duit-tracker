import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';
import {
  filterByMonth, filterByUser, sumAmount, formatRupiah, formatRupiahShort,
  groupByCategoryForUsers, getMonthLabel, groupByDayForMonth,
  groupByCategory,
} from '../utils/format';
import { getCategoryMeta } from '../data/categories';

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

export default function Compare({ transactions }) {
  const [mode, setMode] = useState('user'); // 'user' or 'month'
  const [month1, setMonth1] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [month2, setMonth2] = useState(() => { const d = new Date(); d.setMonth(d.getMonth() - 1); d.setDate(1); return d; });
  const [compareUser, setCompareUser] = useState('all');

  // === USER VS USER MODE ===
  const userCompareData = useMemo(() => {
    if (mode !== 'user') return null;
    const catData = groupByCategoryForUsers(transactions, month1);

    const rickyTxs = filterByMonth(filterByUser(transactions, 'ricky'), month1).filter(t => t.type === 'expense');
    const andreaTxs = filterByMonth(filterByUser(transactions, 'andrea'), month1).filter(t => t.type === 'expense');
    const rickyTotal = sumAmount(rickyTxs);
    const andreaTotal = sumAmount(andreaTxs);
    const totalAll = rickyTotal + andreaTotal;

    const pieData = [
      { name: 'Ricky', value: rickyTotal },
      { name: 'Andrea', value: andreaTotal },
    ];

    return { catData, rickyTotal, andreaTotal, totalAll, pieData, rickyCount: rickyTxs.length, andreaCount: andreaTxs.length };
  }, [transactions, month1, mode]);

  // === MONTH VS MONTH MODE ===
  const monthCompareData = useMemo(() => {
    if (mode !== 'month') return null;
    const txs = compareUser === 'all' ? transactions : filterByUser(transactions, compareUser);

    const m1Txs = filterByMonth(txs, month1).filter(t => t.type === 'expense');
    const m2Txs = filterByMonth(txs, month2).filter(t => t.type === 'expense');

    const m1Total = sumAmount(m1Txs);
    const m2Total = sumAmount(m2Txs);
    const diff = m1Total - m2Total;
    const pctChange = m2Total > 0 ? Math.round(((m1Total - m2Total) / m2Total) * 100) : 0;

    // Category comparison
    const m1Cat = groupByCategory(m1Txs);
    const m2Cat = groupByCategory(m2Txs);
    const allCategories = new Set([...m1Cat.map(c => c.name), ...m2Cat.map(c => c.name)]);
    const catCompare = Array.from(allCategories).map(cat => ({
      category: cat,
      [getMonthLabel(month1)]: m1Cat.find(c => c.name === cat)?.amount || 0,
      [getMonthLabel(month2)]: m2Cat.find(c => c.name === cat)?.amount || 0,
    })).sort((a, b) => {
      const aTotal = a[getMonthLabel(month1)] + a[getMonthLabel(month2)];
      const bTotal = b[getMonthLabel(month1)] + b[getMonthLabel(month2)];
      return bTotal - aTotal;
    });

    // Daily spending overlay
    const dailyM1 = groupByDayForMonth(txs.filter(t => t.type === 'expense'), month1);
    const dailyM2 = groupByDayForMonth(txs.filter(t => t.type === 'expense'), month2);
    const maxDays = Math.max(dailyM1.length, dailyM2.length);
    const dailyOverlay = [];
    for (let i = 0; i < maxDays; i++) {
      dailyOverlay.push({
        label: `${i + 1}`,
        [getMonthLabel(month1)]: dailyM1[i]?.expense || 0,
        [getMonthLabel(month2)]: dailyM2[i]?.expense || 0,
      });
    }

    return { m1Total, m2Total, diff, pctChange, catCompare, dailyOverlay, m1Count: m1Txs.length, m2Count: m2Txs.length };
  }, [transactions, month1, month2, mode, compareUser]);

  function monthToInput(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
  function inputToMonth(val) {
    const [y, m] = val.split('-');
    return new Date(parseInt(y), parseInt(m) - 1, 1);
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div>
          <div className="page-title">📊 Perbandingan</div>
          <div className="page-date">Analisis perbandingan pengeluaran</div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="compare-toggle">
        <button
          className={`compare-toggle-btn${mode === 'user' ? ' active' : ''}`}
          onClick={() => setMode('user')}
        >
          👥 User vs User
        </button>
        <button
          className={`compare-toggle-btn${mode === 'month' ? ' active' : ''}`}
          onClick={() => setMode('month')}
        >
          📅 Bulan vs Bulan
        </button>
      </div>

      {/* Controls */}
      <div className="compare-controls">
        <div className="compare-control-group">
          <label className="form-label">{mode === 'user' ? 'Bulan' : 'Bulan 1'}</label>
          <input
            className="form-input"
            type="month"
            value={monthToInput(month1)}
            onChange={(e) => setMonth1(inputToMonth(e.target.value))}
          />
        </div>
        {mode === 'month' && (
          <>
            <div className="compare-control-group">
              <label className="form-label">Bulan 2</label>
              <input
                className="form-input"
                type="month"
                value={monthToInput(month2)}
                onChange={(e) => setMonth2(inputToMonth(e.target.value))}
              />
            </div>
            <div className="compare-control-group">
              <label className="form-label">Pengguna</label>
              <select
                className="form-select"
                value={compareUser}
                onChange={(e) => setCompareUser(e.target.value)}
              >
                <option value="all">Semua</option>
                <option value="ricky">Ricky</option>
                <option value="andrea">Andrea</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* ==================== USER VS USER ==================== */}
      {mode === 'user' && userCompareData && (
        <div className="compare-content">
          {/* Summary Cards */}
          <div className="compare-summary-grid">
            <div className="compare-summary-card ricky">
              <div className="compare-avatar avatar-ricky">R</div>
              <div>
                <div className="compare-name">Ricky</div>
                <div className="compare-amount">{formatRupiah(userCompareData.rickyTotal)}</div>
                <div className="compare-sub">{userCompareData.rickyCount} transaksi</div>
              </div>
            </div>
            <div className="compare-vs">
              <div className="vs-circle">VS</div>
              <div className="vs-diff">
                {userCompareData.rickyTotal > userCompareData.andreaTotal
                  ? `Ricky +${formatRupiah(userCompareData.rickyTotal - userCompareData.andreaTotal)}`
                  : userCompareData.andreaTotal > userCompareData.rickyTotal
                  ? `Andrea +${formatRupiah(userCompareData.andreaTotal - userCompareData.rickyTotal)}`
                  : 'Sama rata! 🤝'}
              </div>
            </div>
            <div className="compare-summary-card andrea">
              <div className="compare-avatar avatar-andrea">A</div>
              <div>
                <div className="compare-name">Andrea</div>
                <div className="compare-amount">{formatRupiah(userCompareData.andreaTotal)}</div>
                <div className="compare-sub">{userCompareData.andreaCount} transaksi</div>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            {/* Category Bar Chart */}
            <div className="chart-card chart-full">
              <div className="chart-title">📊 Pengeluaran per Kategori — {getMonthLabel(month1)}</div>
              {userCompareData.catData.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📭</div><p>Belum ada data pengeluaran</p></div>
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(240, userCompareData.catData.length * 50 + 40)}>
                  <BarChart data={userCompareData.catData} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#8b91a8', fontSize: 10 }} tickFormatter={formatRupiahShort} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="category" tick={{ fill: '#f0f2f7', fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} />
                    <Bar dataKey="ricky" name="Ricky" fill="#6c63ff" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="andrea" name="Andrea" fill="#f472b6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie Chart */}
            <div className="chart-card">
              <div className="chart-title">🍩 Share Pengeluaran</div>
              {userCompareData.totalAll === 0 ? (
                <div className="empty-state"><div className="empty-icon">📭</div><p>Belum ada data</p></div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={userCompareData.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                      <Cell fill="#6c63ff" />
                      <Cell fill="#f472b6" />
                    </Pie>
                    <Tooltip formatter={(v) => formatRupiah(v)} contentStyle={{ background: '#1e2230', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#8b91a8', fontSize: 11 }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Percentage Breakdown */}
            <div className="chart-card">
              <div className="chart-title">📈 Persentase per Kategori</div>
              {userCompareData.catData.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📭</div><p>Belum ada data</p></div>
              ) : (
                <div className="pct-breakdown">
                  {userCompareData.catData.map(cat => {
                    const total = cat.ricky + cat.andrea;
                    const rPct = total > 0 ? Math.round((cat.ricky / total) * 100) : 0;
                    const meta = getCategoryMeta(cat.category);
                    return (
                      <div key={cat.category} className="pct-row">
                        <div className="pct-label">{meta.icon} {cat.category}</div>
                        <div className="pct-bar-wrapper">
                          <div className="pct-bar-ricky" style={{ width: `${rPct}%` }} />
                          <div className="pct-bar-andrea" style={{ width: `${100 - rPct}%` }} />
                        </div>
                        <div className="pct-values">
                          <span style={{ color: 'var(--accent2)' }}>{rPct}%</span>
                          <span style={{ color: 'var(--pink)' }}>{100 - rPct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MONTH VS MONTH ==================== */}
      {mode === 'month' && monthCompareData && (
        <div className="compare-content">
          {/* Summary */}
          <div className="compare-month-summary">
            <div className="compare-month-card">
              <div className="compare-month-label">{getMonthLabel(month1)}</div>
              <div className="compare-month-amount">{formatRupiah(monthCompareData.m1Total)}</div>
              <div className="compare-sub">{monthCompareData.m1Count} transaksi</div>
            </div>
            <div className="compare-vs">
              <div className={`vs-change ${monthCompareData.diff > 0 ? 'up' : monthCompareData.diff < 0 ? 'down' : ''}`}>
                {monthCompareData.diff > 0 ? '📈' : monthCompareData.diff < 0 ? '📉' : '➡️'}
                {monthCompareData.pctChange > 0 ? '+' : ''}{monthCompareData.pctChange}%
              </div>
              <div className="vs-diff-label">
                {monthCompareData.diff > 0
                  ? `Naik ${formatRupiah(Math.abs(monthCompareData.diff))}`
                  : monthCompareData.diff < 0
                  ? `Turun ${formatRupiah(Math.abs(monthCompareData.diff))}`
                  : 'Sama'}
              </div>
            </div>
            <div className="compare-month-card">
              <div className="compare-month-label">{getMonthLabel(month2)}</div>
              <div className="compare-month-amount">{formatRupiah(monthCompareData.m2Total)}</div>
              <div className="compare-sub">{monthCompareData.m2Count} transaksi</div>
            </div>
          </div>

          <div className="charts-grid">
            {/* Daily Overlay */}
            <div className="chart-card chart-full">
              <div className="chart-title">📈 Pengeluaran Harian — Overlay</div>
              <div className="legend-row">
                <span className="legend-dot" style={{ background: '#6c63ff' }} /> {getMonthLabel(month1)}
                <span className="legend-dot" style={{ background: '#f472b6', marginLeft: 14 }} /> {getMonthLabel(month2)}
              </div>
              {monthCompareData.dailyOverlay.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📭</div><p>Belum ada data</p></div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={monthCompareData.dailyOverlay}>
                    <defs>
                      <linearGradient id="gM1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gM2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label" tick={{ fill: '#8b91a8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8b91a8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatRupiahShort} width={70} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey={getMonthLabel(month1)} stroke="#6c63ff" fill="url(#gM1)" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey={getMonthLabel(month2)} stroke="#f472b6" fill="url(#gM2)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Comparison Bar */}
            <div className="chart-card chart-full">
              <div className="chart-title">📊 Perbandingan per Kategori</div>
              {monthCompareData.catCompare.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📭</div><p>Belum ada data</p></div>
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(240, monthCompareData.catCompare.length * 50 + 40)}>
                  <BarChart data={monthCompareData.catCompare} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#8b91a8', fontSize: 10 }} tickFormatter={formatRupiahShort} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="category" tick={{ fill: '#f0f2f7', fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} />
                    <Bar dataKey={getMonthLabel(month1)} fill="#6c63ff" radius={[0, 4, 4, 0]} />
                    <Bar dataKey={getMonthLabel(month2)} fill="#f472b6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Detail Table */}
            <div className="chart-card chart-full">
              <div className="chart-title">📋 Detail Perubahan per Kategori</div>
              {monthCompareData.catCompare.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📭</div><p>Belum ada data</p></div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table compact">
                    <thead>
                      <tr>
                        <th>Kategori</th>
                        <th>{getMonthLabel(month1)}</th>
                        <th>{getMonthLabel(month2)}</th>
                        <th>Perubahan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthCompareData.catCompare.map(cat => {
                        const v1 = cat[getMonthLabel(month1)];
                        const v2 = cat[getMonthLabel(month2)];
                        const change = v1 - v2;
                        const pct = v2 > 0 ? Math.round(((v1 - v2) / v2) * 100) : v1 > 0 ? 100 : 0;
                        const meta = getCategoryMeta(cat.category);
                        return (
                          <tr key={cat.category}>
                            <td>{meta.icon} {cat.category}</td>
                            <td className="text-mono">{formatRupiah(v1)}</td>
                            <td className="text-mono">{formatRupiah(v2)}</td>
                            <td className={`text-mono ${change > 0 ? 'text-red' : change < 0 ? 'text-green' : ''}`}>
                              {change > 0 ? '↑' : change < 0 ? '↓' : '='} {formatRupiah(Math.abs(change))}
                              <span className="change-pct"> ({pct > 0 ? '+' : ''}{pct}%)</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
