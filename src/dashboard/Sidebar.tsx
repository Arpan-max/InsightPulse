import React, { useState } from 'react';
import Papa from 'papaparse';
import { PIPELINE_STEPS } from '../pipeline/registry';
import { PipelineStepInstance } from '../pipeline/types';

export const Sidebar: React.FC<{
  steps: PipelineStepInstance[];
  setSteps: React.Dispatch<React.SetStateAction<PipelineStepInstance[]>>;
  onDataLoad: (data: any[], filename: string) => void;
  filename: string;
  errors: Record<string, string>;
  columns: string[];
}> = ({ steps, setSteps, onDataLoad, filename, errors, columns }) => {
  const [showAddStep, setShowAddStep] = useState(false);

  const loadSample = async () => {
    const res = await fetch('/sample_sales.csv');
    const text = await res.text();
    Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        onDataLoad(results.data, 'sample_sales.csv');
      }
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        onDataLoad(results.data, file.name);
      }
    });
  };

  const addStep = (stepId: string) => {
    const stepDef = PIPELINE_STEPS[stepId];
    if (stepDef) {
      setSteps([...steps, {
        instanceId: Math.random().toString(36).substring(7),
        stepId,
        config: JSON.parse(JSON.stringify(stepDef.defaultConfig))
      }]);
    }
    setShowAddStep(false);
  };

  const updateStep = (instanceId: string, newConfig: any) => {
    setSteps(steps.map(s => s.instanceId === instanceId ? { ...s, config: newConfig } : s));
  };

  const removeStep = (instanceId: string) => {
    setSteps(steps.filter(s => s.instanceId !== instanceId));
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= steps.length) return;
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + direction];
    newSteps[index + direction] = temp;
    setSteps(newSteps);
  };

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm shrink-0 h-full overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold tracking-tighter">IP</div>
        <h1 className="text-xl font-bold tracking-tight">InsightPulse</h1>
      </div>

      <div className="p-5 flex-1 overflow-y-auto flex flex-col">
        <div className="mb-6 shrink-0">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Data Source</label>
          {filename ? (
            <div className="flex items-center justify-between gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-sm font-medium">
              <div className="flex items-center gap-2 truncate">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <span className="truncate">{filename}</span>
              </div>
              <span className="text-[10px] bg-blue-200 px-1.5 py-0.5 rounded uppercase shrink-0">Active</span>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block w-full text-center p-3 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-50 hover:border-blue-400">
                Upload CSV File
                <input type="file" accept=".csv" className="hidden" onChange={handleUpload} />
              </label>
              <button onClick={loadSample} className="w-full text-[11px] font-bold text-blue-600 bg-blue-50 py-2 rounded-lg hover:bg-blue-100">
                Or Use Sample Dataset
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pipeline Steps ({steps.length})</label>
            <div className="relative">
              <button onClick={() => setShowAddStep(!showAddStep)} className="text-[10px] text-blue-600 font-bold hover:underline">
                + Add Step
              </button>
              {showAddStep && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded shadow-lg z-50 max-h-64 overflow-y-auto">
                  {Object.values(PIPELINE_STEPS).map(def => (
                    <button key={def.id} onClick={() => addStep(def.id)} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 border-b border-slate-100 last:border-0 font-medium">
                      {def.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pb-4">
            {steps.map((step, idx) => {
              const def = PIPELINE_STEPS[step.stepId];
              const error = errors[step.instanceId];
              return (
                <div key={step.instanceId} className={`p-3 border rounded-lg relative ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">{idx + 1}. {def?.label || step.stepId}</span>
                    <div className="flex gap-1">
                      <button onClick={() => moveStep(idx, -1)} disabled={idx === 0} className="text-slate-400 hover:text-slate-600 disabled:opacity-50">↑</button>
                      <button onClick={() => moveStep(idx, 1)} disabled={idx === steps.length - 1} className="text-slate-400 hover:text-slate-600 disabled:opacity-50">↓</button>
                      <button onClick={() => removeStep(step.instanceId)} className="text-red-400 hover:text-red-600 ml-1">✕</button>
                    </div>
                  </div>
                  {error && <div className="text-[10px] text-red-600 font-bold mb-2 p-1 bg-red-100 rounded">{error}</div>}
                  {def && (
                    <div className="mt-2 pt-2 border-t border-slate-200/50">
                      <def.renderConfig config={step.config} onChange={(c) => updateStep(step.instanceId, c)} columns={columns} />
                    </div>
                  )}
                </div>
              );
            })}
            {steps.length === 0 && (
              <div className="text-center p-4 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
                No steps added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
