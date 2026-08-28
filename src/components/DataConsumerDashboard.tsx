import React, { useState, useEffect } from 'react';
import { VerifiedLoan, AuditLog } from '../types';
import { fetchVerifiedLoans, fetchAuditLogs } from '../api';
import { ShieldCheck, Download, History, Key, CheckCircle2, FileJson, FileText, ArrowRight, Activity } from 'lucide-react';

interface DataConsumerDashboardProps {
  dqScore: number;
}

export const DataConsumerDashboard: React.FC<DataConsumerDashboardProps> = ({ dqScore }) => {
  const [verifiedLoans, setVerifiedLoans] = useState<VerifiedLoan[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const vLoans = await fetchVerifiedLoans();
      setVerifiedLoans(vLoans);
      const aLogs = await fetchAuditLogs(selectedLoanId || undefined);
      setAuditLogs(aLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedLoanId]);

  const handleExportVerifiedCSV = async () => {
    try {
      const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
      const apiBase = rawBaseUrl ? `${rawBaseUrl}/api` : '/api';
      const res = await fetch(`${apiBase}/verified-loans/export/csv`);
      if (!res.ok) throw new Error('Export CSV failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `verified_loans_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed exporting CSV', err);
    }
  };

  const handleExportAuditJSON = async () => {
    try {
      const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
      const apiBase = rawBaseUrl ? `${rawBaseUrl}/api` : '/api';
      const res = await fetch(`${apiBase}/audit/export/json`);
      if (!res.ok) throw new Error('Export JSON failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_trail_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed exporting JSON', err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Module E & F — Verified Records & Audit Lineage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">Data Consumer Dashboard</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Access trusted, canonical loan data backed by cryptographic SHA-256 record hashes and complete end-to-end audit trails.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportVerifiedCSV}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Export Verified CSV</span>
          </button>

          <button
            onClick={handleExportAuditJSON}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <FileJson className="w-4 h-4" />
            <span>Export Audit Trail JSON</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
        
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-slate-900/60 shadow-xl flex items-center space-x-4 sm:space-x-5">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner flex-shrink-0">
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Data Quality Score</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5 block">{dqScore.toFixed(1)}%</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-0.5">Across all ingested records</span>
          </div>
        </div>

        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800/80 shadow-xl flex items-center space-x-4 sm:space-x-5">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-inner flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Verified Loans</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-0.5 block">{verifiedLoans.length}</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-0.5">Canonical records created</span>
          </div>
        </div>

        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800/80 shadow-xl flex items-center space-x-4 sm:space-x-5">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-inner flex-shrink-0">
            <Key className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Security Protocol</span>
            <span className="text-lg sm:text-xl font-black text-sky-300 mt-0.5 block">SHA-256 Digest</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-0.5">Immutable record locks</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Verified Records Table + Audit Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Verified Loans Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Verified Loan Master Ledger</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{verifiedLoans.length} Records</span>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl">
            <div className="overflow-x-auto max-h-[500px] no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-md text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Loan ID</th>
                    <th className="p-3.5">Verified By</th>
                    <th className="p-3.5">Verified At</th>
                    <th className="p-3.5">SHA-256 Hash</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {verifiedLoans.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No verified records generated yet. Review and approve records in Exception Queue.
                      </td>
                    </tr>
                  ) : (
                    verifiedLoans.map((v) => (
                      <tr 
                        key={v.id}
                        onClick={() => setSelectedLoanId(v.loan_id)}
                        className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          selectedLoanId === v.loan_id ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : ''
                        }`}
                      >
                        <td className="p-3.5 font-bold font-mono text-indigo-300 whitespace-nowrap">{v.loan_id}</td>
                        <td className="p-3.5 text-slate-300 whitespace-nowrap">{v.verified_by}</td>
                        <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {new Date(v.verified_at).toLocaleDateString()} {new Date(v.verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/50 block truncate max-w-[140px]">
                            {v.record_hash}
                          </span>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-end space-x-1 ml-auto">
                            <span>Audit Lineage</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit Lineage Timeline (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <History className="w-5 h-5 text-indigo-400" />
              <span>{selectedLoanId ? `Audit: ${selectedLoanId}` : 'System Audit Trail'}</span>
            </h3>
            {selectedLoanId && (
              <button 
                onClick={() => setSelectedLoanId(null)}
                className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-wider underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800/90 shadow-xl max-h-[500px] overflow-y-auto space-y-4">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No audit log entries recorded.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="relative pl-6 border-l-2 border-slate-800 hover:border-indigo-500 transition-colors py-1">
                  <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">
                      {log.event_type}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-0.5 font-medium">{log.description || (log.metadata_info ? JSON.stringify(log.metadata_info) : log.event_type)}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                    <span>User: <strong className="text-slate-300">{log.performed_by || log.actor_id}</strong></span>
                    {log.loan_id && <span>• Loan: <strong className="text-indigo-300 font-mono">{log.loan_id}</strong></span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
