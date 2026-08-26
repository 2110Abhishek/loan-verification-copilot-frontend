import React, { useState, useEffect } from 'react';
import { fetchValidationRules, toggleValidationRule, clearAllIngestedData } from '../api';
import { ShieldAlert, Settings, Cpu, Database, ToggleLeft, ToggleRight, Trash2, RefreshCw, CheckCircle, ShieldCheck, UserCheck } from 'lucide-react';

interface AdminDashboardProps {
  onRefreshSummary: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onRefreshSummary }) => {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const loadRules = async () => {
    setLoading(true);
    try {
      const data = await fetchValidationRules();
      setRules(data);
    } catch (err) {
      console.error('Failed loading rules', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleToggleRule = async (ruleCode: string) => {
    try {
      await toggleValidationRule(ruleCode);
      loadRules();
    } catch (err) {
      alert('Failed to toggle rule');
    }
  };

  const handleClearData = async () => {
    if (!window.confirm("Are you sure you want to reset all datasets, loan records, exceptions, and audit logs?")) return;
    setIsClearing(true);
    try {
      await clearAllIngestedData();
      onRefreshSummary();
      alert("System database reset cleanly!");
    } catch (err) {
      alert("Reset failed");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">System Admin Control Center</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mt-1.5">Rule Management & Engine Configuration</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage active validation rules, configure system thresholds, monitor engine health, and manage role-based access policies.
          </p>
        </div>

        <button
          onClick={handleClearData}
          disabled={isClearing}
          className="px-5 py-3 rounded-2xl text-xs font-bold bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 flex items-center space-x-2 transition-all shadow-lg shadow-rose-600/10 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
          <span>Reset System Database</span>
        </button>
      </div>

      {/* System Status Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Rule Engine</span>
            <span className="text-lg font-black text-emerald-400 mt-0.5 block">ONLINE (16 Rules)</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Database Storage</span>
            <span className="text-lg font-black text-sky-300 mt-0.5 block">SQLite Local Active</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Active Rule Set</span>
            <span className="text-lg font-black text-white mt-0.5 block">{rules.filter(r => r.is_active).length} / {rules.length} Rules</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Current Persona</span>
            <span className="text-lg font-black text-amber-400 mt-0.5 block">System Admin</span>
          </div>
        </div>

      </div>

      {/* Main Table: Validation Rules Management Matrix */}
      <div className="glass-panel rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/90">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              <span>Configured Validation Rules Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Toggle rules on or off to enable or disable validation checks during tape ingestion.</p>
          </div>
          <button
            onClick={loadRules}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            title="Refresh Rules"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Severity</th>
                <th className="px-5 py-4">Rule Code</th>
                <th className="px-5 py-4">Rule Name</th>
                <th className="px-5 py-4">Target Field</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4 text-right">Toggle Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-medium">Loading rule configuration...</td>
                </tr>
              ) : rules.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-all">
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      r.is_active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {r.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-300' : r.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-indigo-300">{r.code}</td>
                  <td className="px-5 py-4 font-semibold text-slate-100">{r.name}</td>
                  <td className="px-5 py-4 font-mono text-slate-400">{r.field}</td>
                  <td className="px-5 py-4 text-slate-400 max-w-xs leading-relaxed">{r.description}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleToggleRule(r.code)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        r.is_active ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title={r.is_active ? "Disable Rule" : "Enable Rule"}
                    >
                      {r.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
