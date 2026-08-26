import React, { useState } from 'react';
import { uploadCSVFile, clearAllIngestedData } from '../api';
import { CurrencyType, formatCurrency } from '../utils/formatters';
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, RefreshCw, ArrowRight, ShieldCheck, Database, FileSpreadsheet, Trash2 } from 'lucide-react';

interface DataOperatorDashboardProps {
  onNavigateToReviewer: () => void;
  onRefreshSummary: () => void;
  currency?: CurrencyType;
}

export const DataOperatorDashboard: React.FC<DataOperatorDashboardProps> = ({
  onNavigateToReviewer,
  onRefreshSummary,
  currency = 'INR'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) {
      setError('Please select a CSV loan tape to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const res = await uploadCSVFile(file, 'usr_op_01');
      setUploadResult(res);
      onRefreshSummary();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all ingested datasets, loan records, exceptions, and audit logs?")) return;
    
    setIsClearing(true);
    try {
      await clearAllIngestedData();
      setUploadResult(null);
      setFile(null);
      onRefreshSummary();
      alert("All dataset entries, exceptions, and logs cleared cleanly!");
    } catch (err: any) {
      alert(err.message || "Failed clearing datasets");
    } finally {
      setIsClearing(false);
    }
  };

  const handleUploadSyntheticSample = async () => {
    setIsUploading(true);
    setError(null);
    try {
      const sampleCsv = `loan_id,borrower_id,loan_type,origination_date,maturity_date,original_principal,current_balance,interest_rate,term_months,borrower_state,loan_purpose,credit_grade,employment_length,income_band,payment_status,days_past_due,servicer_name,last_payment_date,last_updated_at,document_status,source_system
LN-DEMO-001,BR-9001,CONVENTIONAL,2025-01-15,2024-01-15,250000.0,280000.0,6.5,360,CA,PURCHASE,A,5 years,$80k-$100k,CURRENT,45,Apex Servicing Co,2025-02-01,2025-02-10,MISSING,ORIGINATION_SYSTEM_A
LN-00002,BR-1002,CONVENTIONAL,2025-01-10,2055-01-10,350000.0,310000.0,5.8,360,NY,PURCHASE,A+,8 years,$100k-$150k,CURRENT,0,Beacon Loan Care,2025-02-01,2025-02-15,VERIFIED,SERVICING_TAPE_PRIMARY
LN-00003,BR-1003,FHA,2025-02-01,2045-02-01,180000.0,-25000.0,7.2,240,TX,REFINANCE,B,3 years,$50k-$75k,CURRENT,0,Crestview Financial,2025-02-10,2025-02-15,VERIFIED,SERVICING_TAPE_PRIMARY
LN-00004,BR-1004,JUMBO,2025-01-20,2055-01-20,650000.0,600000.0,42.5,360,XYZ,PURCHASE,C,10 years,$150k+,DELINQUENT_30,30,Delta Mortgage Services,2025-02-05,2025-02-18,MISSING,SERVICING_TAPE_PRIMARY
LN-00005,BR-1005,VA,2024-06-15,2054-06-15,220000.0,15000.0,4.5,360,FL,CASH_OUT_REFINANCE,A,4 years,$75k-$100k,CLOSED,0,Eagle Capital Servicing,2025-01-15,2025-01-20,VERIFIED,SERVICING_TAPE_PRIMARY`;

      const sampleFile = new File([sampleCsv], "loan_tape_sample.csv", { type: "text/csv" });
      const res = await uploadCSVFile(sampleFile, "usr_op_01");
      setUploadResult(res);
      setFile(sampleFile);
      onRefreshSummary();
    } catch (err: any) {
      setError(err.message || "Failed uploading sample file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Module A — Data Ingestion & Normalization</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mt-1.5">Ingest Loan Tape & Source Update Files</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Upload CSV loan tapes. The normalization engine cleans currency strings, formats ISO dates, links source lineage, and executes 16 data-quality validation rules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleUploadSyntheticSample}
            disabled={isUploading}
            className="px-5 py-3 rounded-2xl text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 flex items-center space-x-2.5 transition-all shadow-lg shadow-indigo-500/10 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span>Ingest Demo Loan Tape</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={isClearing}
            className="px-4 py-3 rounded-2xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-2 transition-all cursor-pointer"
            title="Reset and clear all dataset entries"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Clear Datasets</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Upload Dropzone (Left 2 cols) & Normalization Cards (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dropzone Card */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col justify-between">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full border-2 border-dashed border-slate-700/80 hover:border-indigo-500/70 rounded-2xl p-10 transition-all duration-300 bg-slate-900/50 cursor-pointer flex flex-col items-center justify-center text-center"
          >
            <div className="p-5 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20 shadow-inner">
              <UploadCloud className="w-12 h-12" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-100">Drag & Drop loan_tape.csv</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Supports loan_tape.csv, servicer_update.csv, and document_manifest.csv format files up to 5,000 rows.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <label className="px-6 py-3 rounded-xl text-xs font-bold gradient-button text-white cursor-pointer shadow-lg shadow-indigo-500/25">
                Choose CSV File
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
              </label>

              {file && (
                <span className="text-xs text-indigo-300 font-mono bg-indigo-950/80 px-4 py-2 rounded-xl border border-indigo-700/60 shadow-sm">
                  📄 {file.name} ({Math.round(file.size / 1024)} KB)
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUploadSubmit}
              disabled={!file || isUploading}
              className={`px-8 py-3.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-all shadow-lg ${
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
        <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-5">
          <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-widest flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Normalization Engine</span>
          </h3>
          
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
              <span className="font-bold text-indigo-400 block mb-1 text-xs">Currency Standardizer</span>
              <p className="text-slate-400 leading-relaxed">
                Cleans `₹10,00,00.00` into canonical float representation `100000.0`.
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
        <div className="glass-panel p-8 rounded-3xl border border-indigo-500/40 bg-indigo-950/20 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800/80 pb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Upload & Validation Completed</h3>
                <p className="text-xs text-slate-400 mt-0.5">File: <span className="font-mono text-slate-200 font-bold">{uploadResult.filename}</span></p>
              </div>
            </div>

            <button
              onClick={onNavigateToReviewer}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <span>Open Exception Queue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Total Rows</span>
              <span className="text-2xl font-black text-slate-100 mt-1 block">{uploadResult.record_count}</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Passed Loans</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">{uploadResult.validation_summary?.passed_loans}</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Loans with Errors</span>
              <span className="text-2xl font-black text-rose-400 mt-1 block">{uploadResult.validation_summary?.failed_loans}</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Exceptions Raised</span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">{uploadResult.validation_summary?.exceptions_raised}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
