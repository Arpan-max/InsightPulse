import React from 'react';

export const DataPreview: React.FC<{ data: any[]; columns: string[]; title?: string }> = ({ data, columns, title = "Raw Uploaded Data" }) => {
  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title} (First 100 rows)</h3>
        <div className="text-[10px] text-slate-500 font-bold">{data.length} Rows • {columns.length} Columns</div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              {columns.map(c => (
                <th key={c} className="px-4 py-3 border-b border-slate-200">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[11px] font-medium text-slate-600">
            {data.slice(0, 100).map((row, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                {columns.map(c => (
                  <td key={c} className="px-4 py-2 truncate max-w-[200px]" title={String(row[c])}>
                    {row[c] === null || row[c] === undefined || row[c] === '' ? (
                      <span className="text-slate-300 italic">null</span>
                    ) : (
                      String(row[c])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
