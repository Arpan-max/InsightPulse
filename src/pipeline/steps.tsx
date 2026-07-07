import React from 'react';
import { PipelineStepDef } from './types';
import { Select, Input, MultiSelect } from '../components/ui';

export const dropNaStep: PipelineStepDef<{ columns: string[] }> = {
  id: 'drop_na',
  label: 'Drop Missing Values',
  defaultConfig: { columns: [] },
  renderConfig: ({ config, onChange, columns }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Columns to check (empty = all)</label>
      <MultiSelect options={columns} selected={config.columns} onChange={cols => onChange({ columns: cols })} />
    </div>
  ),
  apply: (data, config) => {
    const cols = config.columns.length > 0 ? config.columns : Object.keys(data[0] || {});
    return data.filter(row => cols.every(col => row[col] !== null && row[col] !== undefined && row[col] !== ''));
  }
};

export const fillNaStep: PipelineStepDef<{ column: string; value: string }> = {
  id: 'fill_na',
  label: 'Fill Missing Values',
  defaultConfig: { column: '', value: '' },
  renderConfig: ({ config, onChange, columns }) => (
    <div className="space-y-2">
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Column</label>
        <Select value={config.column} onChange={e => onChange({ ...config, column: e.target.value })}>
          <option value="">Select column...</option>
          {columns.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Fill Value</label>
        <Input type="text" value={config.value} onChange={e => onChange({ ...config, value: e.target.value })} placeholder="Value to fill..." />
      </div>
    </div>
  ),
  apply: (data, config) => {
    if (!config.column) return data;
    return data.map(row => {
      const val = row[config.column];
      if (val === null || val === undefined || val === '') {
        return { ...row, [config.column]: config.value };
      }
      return row;
    });
  }
};

export const dropDuplicatesStep: PipelineStepDef<{ columns: string[] }> = {
  id: 'drop_duplicates',
  label: 'Remove Duplicates',
  defaultConfig: { columns: [] },
  renderConfig: ({ config, onChange, columns }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subset Columns (empty = all)</label>
      <MultiSelect options={columns} selected={config.columns} onChange={cols => onChange({ columns: cols })} />
    </div>
  ),
  apply: (data, config) => {
    const seen = new Set();
    const cols = config.columns.length > 0 ? config.columns : Object.keys(data[0] || {});
    return data.filter(row => {
      const key = cols.map(col => row[col]).join('|~|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
};

export const renameColumnStep: PipelineStepDef<{ column: string; newName: string }> = {
  id: 'rename_column',
  label: 'Rename Column',
  defaultConfig: { column: '', newName: '' },
  renderConfig: ({ config, onChange, columns }) => (
    <div className="space-y-2">
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Column</label>
        <Select value={config.column} onChange={e => onChange({ ...config, column: e.target.value })}>
          <option value="">Select column...</option>
          {columns.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">New Name</label>
        <Input type="text" value={config.newName} onChange={e => onChange({ ...config, newName: e.target.value })} placeholder="New name..." />
      </div>
    </div>
  ),
  apply: (data, config) => {
    if (!config.column || !config.newName) return data;
    return data.map(row => {
      const newRow = { ...row };
      newRow[config.newName] = newRow[config.column];
      delete newRow[config.column];
      return newRow;
    });
  }
};

export const selectColumnsStep: PipelineStepDef<{ columns: string[] }> = {
  id: 'select_columns',
  label: 'Keep Columns',
  defaultConfig: { columns: [] },
  renderConfig: ({ config, onChange, columns }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Columns to Keep</label>
      <MultiSelect options={columns} selected={config.columns} onChange={cols => onChange({ columns: cols })} />
    </div>
  ),
  apply: (data, config) => {
    if (config.columns.length === 0) return data;
    return data.map(row => {
      const newRow: any = {};
      config.columns.forEach(c => { newRow[c] = row[c]; });
      return newRow;
    });
  }
};

export const filterRowsStep: PipelineStepDef<{ column: string; operator: string; value: string }> = {
  id: 'filter_rows',
  label: 'Filter Rows',
  defaultConfig: { column: '', operator: 'equals', value: '' },
  renderConfig: ({ config, onChange, columns }) => (
    <div className="space-y-2">
      <Select value={config.column} onChange={e => onChange({ ...config, column: e.target.value })}>
        <option value="">Select column...</option>
        {columns.map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
      <Select value={config.operator} onChange={e => onChange({ ...config, operator: e.target.value })}>
        <option value="equals">equals</option>
        <option value="not equals">not equals</option>
        <option value="greater than">greater than</option>
        <option value="less than">less than</option>
        <option value="contains">contains</option>
      </Select>
      <Input type="text" value={config.value} onChange={e => onChange({ ...config, value: e.target.value })} placeholder="Value..." />
    </div>
  ),
  apply: (data, config) => {
    if (!config.column) return data;
    const numVal = Number(config.value);
    const isNum = !isNaN(numVal) && config.value.trim() !== '';
    return data.filter(row => {
      const val = row[config.column];
      switch (config.operator) {
        case 'equals': return String(val) === String(config.value);
        case 'not equals': return String(val) !== String(config.value);
        case 'greater than': return isNum ? Number(val) > numVal : String(val) > String(config.value);
        case 'less than': return isNum ? Number(val) < numVal : String(val) < String(config.value);
        case 'contains': return String(val).toLowerCase().includes(String(config.value).toLowerCase());
        default: return true;
      }
    });
  }
};

export const castTypeStep: PipelineStepDef<{ column: string; type: string }> = {
  id: 'cast_type',
  label: 'Change Data Type',
  defaultConfig: { column: '', type: 'text' },
  renderConfig: ({ config, onChange, columns }) => (
    <div className="space-y-2">
      <Select value={config.column} onChange={e => onChange({ ...config, column: e.target.value })}>
        <option value="">Select column...</option>
        {columns.map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
      <Select value={config.type} onChange={e => onChange({ ...config, type: e.target.value })}>
        <option value="text">text</option>
        <option value="integer">integer</option>
        <option value="float">float</option>
        <option value="datetime">datetime</option>
        <option value="boolean">boolean</option>
      </Select>
    </div>
  ),
  apply: (data, config) => {
    if (!config.column) return data;
    return data.map(row => {
      const newRow = { ...row };
      const val = row[config.column];
      try {
        if (config.type === 'integer') newRow[config.column] = parseInt(val, 10);
        else if (config.type === 'float') newRow[config.column] = parseFloat(val);
        else if (config.type === 'boolean') newRow[config.column] = Boolean(val) && String(val).toLowerCase() !== 'false' && String(val) !== '0';
        else if (config.type === 'datetime') newRow[config.column] = new Date(val).toISOString();
        else newRow[config.column] = String(val);
      } catch (e) {
        // Soft fail
      }
      return newRow;
    });
  }
};

export const sortValuesStep: PipelineStepDef<{ column: string; ascending: boolean }> = {
  id: 'sort_values',
  label: 'Sort Data',
  defaultConfig: { column: '', ascending: true },
  renderConfig: ({ config, onChange, columns }) => (
    <div className="space-y-2">
      <Select value={config.column} onChange={e => onChange({ ...config, column: e.target.value })}>
        <option value="">Select column...</option>
        {columns.map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={config.ascending} onChange={e => onChange({ ...config, ascending: e.target.checked })} className="rounded text-blue-600 focus:ring-blue-500 w-3 h-3" />
        <span className="text-[11px] text-slate-700">Ascending</span>
      </label>
    </div>
  ),
  apply: (data, config) => {
    if (!config.column) return data;
    return [...data].sort((a, b) => {
      let va = a[config.column];
      let vb = b[config.column];
      if (typeof va === 'number' && typeof vb === 'number') {
        return config.ascending ? va - vb : vb - va;
      }
      va = String(va || '');
      vb = String(vb || '');
      if (va < vb) return config.ascending ? -1 : 1;
      if (va > vb) return config.ascending ? 1 : -1;
      return 0;
    });
  }
};

export const groupByAggregateStep: PipelineStepDef<{ groupCols: string[]; aggregations: { col: string; func: string }[] }> = {
  id: 'group_by_aggregate',
  label: 'Group & Aggregate',
  defaultConfig: { groupCols: [], aggregations: [] },
  renderConfig: ({ config, onChange, columns }) => {
    const addAgg = () => onChange({ ...config, aggregations: [...config.aggregations, { col: columns[0] || '', func: 'count' }] });
    const updateAgg = (index: number, val: any) => {
      const newAggs = [...config.aggregations];
      newAggs[index] = { ...newAggs[index], ...val };
      onChange({ ...config, aggregations: newAggs });
    };
    const removeAgg = (index: number) => {
      onChange({ ...config, aggregations: config.aggregations.filter((_, i) => i !== index) });
    };
    return (
      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Group By</label>
          <MultiSelect options={columns} selected={config.groupCols} onChange={cols => onChange({ ...config, groupCols: cols })} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Aggregations</label>
          {config.aggregations.map((agg, i) => (
            <div key={i} className="flex gap-1 items-center bg-slate-50 p-1 rounded border border-slate-100">
              <Select value={agg.col} onChange={e => updateAgg(i, { col: e.target.value })} className="!py-1 !text-[10px] flex-1">
                {columns.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
              <Select value={agg.func} onChange={e => updateAgg(i, { func: e.target.value })} className="!py-1 !text-[10px] flex-1">
                <option value="sum">sum</option>
                <option value="mean">mean</option>
                <option value="count">count</option>
                <option value="min">min</option>
                <option value="max">max</option>
              </Select>
              <button onClick={() => removeAgg(i)} className="text-red-500 hover:text-red-700 px-1 font-bold text-[10px]">✕</button>
            </div>
          ))}
          <button onClick={addAgg} className="text-[10px] text-blue-600 font-bold hover:underline w-full text-left">+ Add aggregation</button>
        </div>
      </div>
    );
  },
  apply: (data, config) => {
    if (config.groupCols.length === 0 || config.aggregations.length === 0) return data;
    const groups: Record<string, any[]> = {};
    data.forEach(row => {
      const key = config.groupCols.map(c => row[c]).join('|~|');
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });

    return Object.values(groups).map(groupRows => {
      const res: any = {};
      // Group keys
      config.groupCols.forEach(c => { res[c] = groupRows[0][c]; });
      // Aggregations
      config.aggregations.forEach(({ col, func }) => {
        const outName = `${col}_${func}`;
        const vals = groupRows.map(r => Number(r[col])).filter(n => !isNaN(n));
        if (func === 'count') res[outName] = groupRows.length;
        else if (vals.length === 0) res[outName] = null;
        else if (func === 'sum') res[outName] = vals.reduce((a, b) => a + b, 0);
        else if (func === 'mean') res[outName] = vals.reduce((a, b) => a + b, 0) / vals.length;
        else if (func === 'min') res[outName] = Math.min(...vals);
        else if (func === 'max') res[outName] = Math.max(...vals);
      });
      return res;
    });
  }
};

export const addComputedColumnStep: PipelineStepDef<{ name: string; left: string; operator: string; rightType: 'col' | 'val'; rightCol: string; rightVal: string }> = {
  id: 'add_computed_column',
  label: 'Add Computed Column',
  defaultConfig: { name: '', left: '', operator: 'add', rightType: 'col', rightCol: '', rightVal: '0' },
  renderConfig: ({ config, onChange, columns }) => (
    <div className="space-y-2">
      <Input type="text" value={config.name} onChange={e => onChange({ ...config, name: e.target.value })} placeholder="New column name" />
      <Select value={config.left} onChange={e => onChange({ ...config, left: e.target.value })}>
        <option value="">Left column...</option>
        {columns.map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
      <Select value={config.operator} onChange={e => onChange({ ...config, operator: e.target.value })}>
        <option value="add">+</option>
        <option value="subtract">-</option>
        <option value="multiply">*</option>
        <option value="divide">/</option>
      </Select>
      <div className="flex gap-2 items-center">
        <label className="flex items-center gap-1"><input type="radio" checked={config.rightType === 'col'} onChange={() => onChange({ ...config, rightType: 'col' })} className="w-3 h-3"/><span className="text-[10px]">Col</span></label>
        <label className="flex items-center gap-1"><input type="radio" checked={config.rightType === 'val'} onChange={() => onChange({ ...config, rightType: 'val' })} className="w-3 h-3"/><span className="text-[10px]">Val</span></label>
      </div>
      {config.rightType === 'col' ? (
        <Select value={config.rightCol} onChange={e => onChange({ ...config, rightCol: e.target.value })}>
          <option value="">Right column...</option>
          {columns.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      ) : (
        <Input type="number" value={config.rightVal} onChange={e => onChange({ ...config, rightVal: e.target.value })} placeholder="Number value" />
      )}
    </div>
  ),
  apply: (data, config) => {
    if (!config.name || !config.left) return data;
    return data.map(row => {
      const newRow = { ...row };
      const leftVal = Number(row[config.left]);
      const rightVal = config.rightType === 'col' ? Number(row[config.rightCol]) : Number(config.rightVal);
      if (isNaN(leftVal) || isNaN(rightVal)) {
        newRow[config.name] = null;
        return newRow;
      }
      switch (config.operator) {
        case 'add': newRow[config.name] = leftVal + rightVal; break;
        case 'subtract': newRow[config.name] = leftVal - rightVal; break;
        case 'multiply': newRow[config.name] = leftVal * rightVal; break;
        case 'divide': newRow[config.name] = rightVal !== 0 ? leftVal / rightVal : null; break;
      }
      return newRow;
    });
  }
};
