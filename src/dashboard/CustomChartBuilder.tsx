import React, { useState, useMemo } from 'react';
import { Select } from '../components/ui';
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const CustomChartBuilder: React.FC<{ data: any[]; columns: string[] }> = ({ data, columns }) => {
  const [chartType, setChartType] = useState('bar');
  const [xCol, setXCol] = useState(columns[0] || '');
  const [yCol, setYCol] = useState(columns[1] || columns[0] || '');

  const chartData = useMemo(() => {
    if (!xCol || !yCol) return [];
    
    // For bar/line, if there are many rows with same X, we should aggregate Y (sum or avg)
    // To keep it simple, we just take first 100 or aggregate by sum
    const aggregated: Record<string, number> = {};
    data.forEach(row => {
      const x = String(row[xCol] || 'null');
      const y = Number(row[yCol]);
      if (!isNaN(y)) {
        aggregated[x] = (aggregated[x] || 0) + y;
      }
    });

    return Object.keys(aggregated).map(k => ({ [xCol]: k, [yCol]: aggregated[k] })).slice(0, 50); // limit to 50
  }, [data, xCol, yCol]);

  return (
    <div className="col-span-12 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[400px]">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Custom Chart Builder</h3>
        <div className="flex items-center gap-3">
          <Select value={chartType} onChange={e => setChartType(e.target.value)} className="!w-32 !py-1">
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="scatter">Scatter Plot</option>
          </Select>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400">X:</span>
            <Select value={xCol} onChange={e => setXCol(e.target.value)} className="!w-32 !py-1">
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400">Y:</span>
            <Select value={yCol} onChange={e => setYCol(e.target.value)} className="!w-32 !py-1">
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">Select numeric Y column to render chart.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey={xCol} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey={yCol} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
              </LineChart>
            ) : chartType === 'scatter' ? (
              <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="category" dataKey={xCol} name={xCol} tick={{ fontSize: 10 }} />
                <YAxis type="number" dataKey={yCol} name={yCol} tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Scatter name="Data" data={chartData} fill="#3b82f6" />
              </ScatterChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey={xCol} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} cursor={{ fill: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey={yCol} fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
