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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Module E & F — Verified Records & Audit Lineage</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mt-1.5">Data Consumer Dashboard</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Access trusted, canonical loan data backed by cryptographic SHA-256 record hashes and complete end-to-end audit trails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/verified-loans/export/csv"
            download
            className="px-5 py-3 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Export Verified CSV</span>
          </a>

          <a
            href="/api/audit/export/json"
            download
            className="px-5 py-3 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
          >
            <FileJson className="w-4 h-4" />
            <span>Export Audit Trail JSON</span>
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-slate-900/60 shadow-xl flex items-center space-x-5">
          <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Data Quality Score</span>
            <span className="text-3xl font-black text-emerald-400 mt-0.5 block">{dqScore.toFixed(1)}%</span>
            <span className="text-[10px] text-slate-400 block mt-1">Calculated across all ingested records</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 shadow-xl flex items-center space-x-5">
          <div className="p-4 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Verified Loans</span>
            <span className="text-3xl font-black text-white mt-0.5 block">{verifiedLoans.length}</span>
            <span className="text-[10px] text-slate-400 block mt-1">Canonical trusted records created</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 shadow-xl flex items-center space-x-5">
          <div className="p-4 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-inner">
            <Key className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Cryptographic Hash</span>
            <span className="text-sm font-mono font-bold text-sky-300 block truncate max-w-[180px] mt-0.5">
              SHA-256 Verified
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">Immutable record integrity lock</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Verified Loans Table (Left) & Audit Trail Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Verified Loans Dataset */}
        <div className="lg:col-span-7 glass-panel rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/80">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Loan Records</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{verifiedLoans.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-4">Loan ID</th>
                  <th className="px-5 py-4">Decision</th>
                  <th className="px-5 py-4">AI Used</th>
                  <th className="px-5 py-4">Verified By</th>
                  <th className="px-5 py-4">SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500 font-medium">Loading verified dataset...</td>
                  </tr>
                ) : verifiedLoans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500 font-medium">
                      No verified records created yet. Complete reviewer approvals in Exception Queue.
                    </td>
                  </tr>
                ) : (
                  verifiedLoans.map((v) => (
                    <tr
                      key={v.id}
                      onClick={() => setSelectedLoanId(v.loan_id)}
                      className={`cursor-pointer transition-all duration-150 ${
                        selectedLoanId === v.loan_id ? 'bg-indigo-950/50 border-l-4 border-emerald-500' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-5 py-4 font-mono font-bold text-slate-100">{v.loan_id}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {v.reviewer_decision}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {v.ai_recommendation_used ? (
                          <span className="text-indigo-400 font-bold">✓ Yes</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-400 font-mono text-[10px]">{v.verified_by}</td>
                      <td className="px-5 py-4 font-mono text-[10px] text-sky-400 truncate max-w-[120px]">
                        {v.record_hash.substring(0, 16)}...
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Interactive Visual Audit Trail Timeline */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800/80 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Audit Lineage Timeline</span>
            </h3>
            {selectedLoanId && (
              <button
                onClick={() => setSelectedLoanId(null)}
                className="text-[10px] font-bold text-indigo-400 hover:underline cursor-pointer"
              >
                Clear Filter ({selectedLoanId})
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {auditLogs.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500 font-medium">No audit events logged.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="relative pl-6 border-l-2 border-slate-800 space-y-1">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900 shadow-md" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">{log.event_type}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {log.loan_id && (
                    <span className="text-[10px] text-slate-400 font-mono block font-semibold">Loan: {log.loan_id}</span>
                  )}

                  <div className="text-[11px] text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 font-mono space-y-1 shadow-sm">
                    <div>Actor: <span className="text-slate-200 font-bold">{log.actor_role} ({log.actor_id})</span></div>
                    {log.metadata_info && Object.keys(log.metadata_info).length > 0 && (
                      <div className="text-[10px] text-slate-400 truncate">
                        Meta: {JSON.stringify(log.metadata_info)}
                      </div>
                    )}
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
