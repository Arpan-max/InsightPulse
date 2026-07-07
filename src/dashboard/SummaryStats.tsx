import React, { useMemo } from 'react';

export const SummaryStats: React.FC<{ data: any[]; columns: string[] }> = ({ data, columns }) => {
  const stats = useMemo(() => {
    return columns.map(col => {
      let nonNulls = 0;
      let numericVals: number[] = [];
      const uniques = new Set();
      
      data.forEach(row => {
        const val = row[col];
        if (val !== null && val !== undefined && val !== '') {
          nonNulls++;
          uniques.add(val);
          if (typeof val === 'number') numericVals.push(val);
          else if (!isNaN(Number(val)) && typeof val === 'string' && val.trim() !== '') {
            numericVals.push(Number(val));
          }
        }
      });

      const type = numericVals.length === nonNulls && nonNulls > 0 ? 'numeric' : 'categorical';
      let mean = '-', min = '-', max = '-';
      
      if (type === 'numeric' && numericVals.length > 0) {
        min = Math.min(...numericVals).toFixed(2);
        max = Math.max(...numericVals).toFixed(2);
        mean = (numericVals.reduce((a,b) => a+b, 0) / numericVals.length).toFixed(2);
      } else if (nonNulls > 0) {
        // Mode approximation for categorical
        const counts: Record<string, number> = {};
        data.forEach(r => {
          const v = String(r[col]);
          counts[v] = (counts[v] || 0) + 1;
        });
        mean = Object.entries(counts).sort((a,b) => b[1] - a[1])[0][0]; // Mode
      }

      return {
        col,
        type,
        nonNulls,
        nulls: data.length - nonNulls,
        uniques: uniques.size,
        mean,
        min,
        max
      };
    });
  }, [data, columns]);

  return (
    <div className="col-span-12 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Data Profile</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              <th className="px-6 py-3 border-b border-slate-200">Feature</th>
              <th className="px-6 py-3 border-b border-slate-200">Type</th>
              <th className="px-6 py-3 border-b border-slate-200">Unique</th>
              <th className="px-6 py-3 border-b border-slate-200">Nulls</th>
              <th className="px-6 py-3 border-b border-slate-200">Mean / Mode</th>
              <th className="px-6 py-3 border-b border-slate-200">Min</th>
              <th className="px-6 py-3 border-b border-slate-200">Max</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-medium text-slate-600">
            {stats.map(s => (
              <tr key={s.col} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-2.5 font-bold text-slate-900 italic">{s.col}</td>
                <td className="px-6 py-2.5 text-slate-400">{s.type}</td>
                <td className="px-6 py-2.5 font-mono">{s.uniques.toLocaleString()}</td>
                <td className={`px-6 py-2.5 font-bold ${s.nulls > 0 ? 'text-red-500' : 'text-emerald-600'}`}>{s.nulls.toLocaleString()}</td>
                <td className="px-6 py-2.5 font-mono max-w-[150px] truncate" title={String(s.mean)}>{s.mean}</td>
                <td className="px-6 py-2.5 font-mono">{s.min}</td>
                <td className="px-6 py-2.5 font-mono">{s.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
