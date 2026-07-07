import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AutoCharts: React.FC<{ data: any[]; columns: string[] }> = ({ data, columns }) => {
  const chartData = useMemo(() => {
    // Find first categorical column with < 20 unique values to plot counts
    let targetCol = '';
    let bestCounts: any[] = [];
    
    for (const col of columns) {
      const counts: Record<string, number> = {};
      data.forEach(r => {
        const v = String(r[col] || 'null');
        counts[v] = (counts[v] || 0) + 1;
      });
      const keys = Object.keys(counts);
      if (keys.length > 1 && keys.length <= 15) {
        targetCol = col;
        bestCounts = keys.map(k => ({ name: k, count: counts[k] })).sort((a,b) => b.count - a.count);
        break;
      }
    }

    // Also find a numeric column to show basic sum or average if possible, but count is safest for auto-chart
    return { targetCol, counts: bestCounts };
  }, [data, columns]);

  if (!chartData.targetCol) return null;

  return (
    <div className="col-span-12 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[300px]">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Auto-Insight: Records by {chartData.targetCol}</h3>
      </div>
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.counts} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
