import React, { useState } from 'react';
import { uploadCSVFile, clearAllIngestedData } from '../api';
import { CurrencyType, formatCurrency } from '../utils/formatters';
import { 
  Upload, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Database, 
  ShieldCheck, 
  FileText,
  RefreshCw,
  Trash2
} from 'lucide-react';

interface DataOperatorDashboardProps {
  onNavigateToReviewer: () => void;
  onRefreshSummary: () => void;
  currency?: CurrencyType;
}

export const DataOperatorDashboard: React.FC<DataOperatorDashboardProps> = ({
  onNavigateToReviewer,
  onRefreshSummary,
  currency = 'USD'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrorMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setErrorMsg(null);

    try {
      const result = await uploadCSVFile(file);
      setUploadResult(result);
      onRefreshSummary();
    } catch (err: any) {
      setErrorMsg(err.message || 'CSV Ingestion failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm("Are you sure you want to reset and clear all ingested data?")) return;
    setIsClearing(true);
    try {
      await clearAllIngestedData();
      setFile(null);
      setUploadResult(null);
      onRefreshSummary();
    } catch (err: any) {
      alert(err.message || 'Reset failed');
    } finally {
      setIsClearing(false);
    }
  };

  const loadDemoFile = async (fileName: string) => {
    setIsUploading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`/${fileName}`);
      if (!response.ok) throw new Error(`Demo file '${fileName}' not found in public directory.`);
      const blob = await response.blob();
      const demoFile = new File([blob], fileName, { type: 'text/csv' });
      setFile(demoFile);
      const result = await uploadCSVFile(demoFile);
      setUploadResult(result);
      onRefreshSummary();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed loading demo tape');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Module A — Data Ingestion & Normalization</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">Data Operator Console</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Upload messy loan tapes (`loan_tape.csv`, `servicer_update.csv`, `document_manifest.csv`). The ingestion engine normalizes schemas, standardizes currency/dates, preserves row lineage, and executes 16 data-quality validation rules.
          </p>
        </div>

        {/* Quick Demo Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => loadDemoFile('loan_tape.csv')}
            disabled={isUploading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Load Demo Tape (1,200 Loans)</span>
          </button>

          <button
            onClick={handleClearData}
            disabled={isClearing}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Upload Dropzone + Normalization Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Drag & Drop Column (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <Upload className="w-5 h-5 text-indigo-400" />
              <span>CSV Ingestion Pipeline</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Supports CSV / UTF-8</span>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-12 text-center transition-all ${
              file ? 'border-emerald-500/60 bg-emerald-950/10' : 'border-slate-700/80 bg-slate-900/50 hover:border-indigo-500/60'
            }`}
          >
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
              {file ? <FileCheck className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" /> : <Upload className="w-6 h-6 sm:w-8 sm:h-8" />}
            </div>

            <h4 className="text-base sm:text-lg font-bold text-slate-200">
              {file ? file.name : 'Drag & Drop loan_tape.csv'}
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Supports `loan_tape.csv`, `servicer_update.csv`, and `document_manifest.csv` format files up to 5,000 rows.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <label className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer transition-all">
                Choose CSV File
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
              </label>

              {file && (
                <span className="text-xs text-slate-400 font-mono bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  {file.name} ({(file.size / 1024).toFixed(0)} KB)
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-lg ${
                !file || isUploading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 cursor-pointer'
              }`}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Ingesting & Validating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ingest & Validate Tape</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Normalization Specs Column */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-5">
          <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-widest flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Normalization Engine</span>
          </h3>
          
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
              <span className="font-bold text-indigo-400 block mb-1 text-xs">Currency Standardizer</span>
              <p className="text-slate-400 leading-relaxed">
                Cleans `{formatCurrency(100000, currency)}` into canonical float representation `100000.0`.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
              <span className="font-bold text-sky-400 block mb-1 text-xs">ISO 8601 Date Normalization</span>
              <p className="text-slate-400 leading-relaxed">Converts messy dates into `YYYY-MM-DD` standard ISO format.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
              <span className="font-bold text-emerald-400 block mb-1 text-xs">Source Lineage Tracking</span>
              <p className="text-slate-400 leading-relaxed">Preserves original raw CSV row data linked to upload ID.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Upload Results Summary Card */}
      {uploadResult && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 bg-indigo-950/20 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800/80 pb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Upload & Validation Completed</h3>
                <p className="text-xs text-slate-400 mt-0.5">File: <span className="font-mono text-slate-200 font-bold">{uploadResult.filename}</span></p>
              </div>
            </div>

            <button
              onClick={onNavigateToReviewer}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>Open Exception Queue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Total Rows</span>
              <span className="text-xl sm:text-2xl font-black text-slate-100 mt-1 block">{uploadResult.record_count}</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Passed Loans</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">{uploadResult.validation_summary?.passed_loans}</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Failed Loans</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400 mt-1 block">{uploadResult.validation_summary?.failed_loans}</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Exceptions Raised</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">{uploadResult.validation_summary?.exceptions_raised}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
