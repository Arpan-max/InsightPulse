import React, { useState, useMemo } from 'react';
import { Sidebar } from './dashboard/Sidebar';
import { PipelineStepInstance } from './pipeline/types';
import { runPipeline } from './pipeline/executor';
import Papa from 'papaparse';
import { DataPreview } from './dashboard/DataPreview';
import { SummaryStats } from './dashboard/SummaryStats';
import { AutoCharts } from './dashboard/AutoCharts';
import { CustomChartBuilder } from './dashboard/CustomChartBuilder';

export default function App() {
  const [rawData, setRawData] = useState<any[]>([]);
  const [filename, setFilename] = useState('');
  const [steps, setSteps] = useState<PipelineStepInstance[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'pipeline' | 'dashboard'>('dashboard');

  const rawColumns = rawData.length > 0 ? Object.keys(rawData[0]) : [];

  const { result: transformedData, errors } = useMemo(() => {
    if (rawData.length === 0) return { result: [], errors: {} };
    return runPipeline(rawData, steps);
  }, [rawData, steps]);

  const displayData = transformedData.length > 0 ? transformedData : rawData;
  const currentColumns = displayData.length > 0 ? Object.keys(displayData[0]) : [];

  const handleExport = () => {
    if (displayData.length === 0) return;
    const csv = Papa.unparse(displayData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'insightpulse_export.csv';
    a.click();
  };

  return (
    <div className="h-screen w-full flex bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden select-none">
      <Sidebar 
        steps={steps} 
        setSteps={setSteps} 
        onDataLoad={(data, name) => { setRawData(data); setFilename(name); setSteps([]); setActiveTab('preview'); }}
        filename={filename}
        errors={errors}
        columns={currentColumns}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shrink-0">
          <nav className="flex gap-8 h-full items-center">
            <button onClick={() => setActiveTab('preview')} className={`text-xs font-bold h-full border-b-2 ${activeTab === 'preview' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>📄 Data Preview</button>
            <button onClick={() => setActiveTab('pipeline')} className={`text-xs font-bold h-full border-b-2 ${activeTab === 'pipeline' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>⚙️ Pipeline & Result</button>
            <button onClick={() => setActiveTab('dashboard')} className={`text-xs font-bold h-full border-b-2 ${activeTab === 'dashboard' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>📊 Dashboard</button>
          </nav>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Status</div>
              <div className="text-xs font-bold text-emerald-600">{Object.keys(errors).length > 0 ? 'Pipeline Error' : 'Live Recompute Active'}</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rows</span>
              <span className="font-mono text-sm font-bold bg-slate-100 px-2 py-1 rounded">{displayData.length.toLocaleString()}</span>
            </div>
            <button onClick={handleExport} className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-slate-800">Export CSV</button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 relative">
          {rawData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">👋</div>
                <h2 className="text-lg font-bold text-slate-700 mb-2">Welcome to InsightPulse</h2>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">Upload a CSV in the sidebar, or click 'Use Sample Dataset', to get started.</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {activeTab === 'preview' && <DataPreview data={rawData} columns={rawColumns} />}
              {activeTab === 'pipeline' && <DataPreview data={transformedData} columns={currentColumns} title="Transformed Data" />}
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-12 gap-6 pb-12">
                  <SummaryStats data={displayData} columns={currentColumns} />
                  <AutoCharts data={displayData} columns={currentColumns} />
                  <CustomChartBuilder data={displayData} columns={currentColumns} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
