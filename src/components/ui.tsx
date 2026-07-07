import React from 'react';

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className={`w-full text-xs font-medium bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${props.className || ''}`}>
    {props.children}
  </select>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`w-full text-xs font-medium bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${props.className || ''}`} />
);

export const MultiSelect: React.FC<{ options: string[]; selected: string[]; onChange: (selected: string[]) => void }> = ({ options, selected, onChange }) => {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter(o => o !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div className="max-h-32 overflow-y-auto border border-slate-200 rounded bg-white p-1 space-y-0.5">
      {options.length === 0 && <div className="text-[10px] text-slate-400 p-1">No options</div>}
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-2 px-1.5 py-1 hover:bg-slate-50 rounded cursor-pointer">
          <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3 h-3" />
          <span className="text-[11px] text-slate-700 truncate">{opt}</span>
        </label>
      ))}
    </div>
  );
};
