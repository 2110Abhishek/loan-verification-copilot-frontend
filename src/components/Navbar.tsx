import React from 'react';
import { RoleType } from '../types';
import { ShieldCheck, UserCheck, Database, Cpu, Sparkles, Activity, Settings } from 'lucide-react';

interface NavbarProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  dqScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  dqScore
}) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-8 py-3 mb-8 shadow-2xl">
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left Section: Brand & System Title */}
        <div className="flex items-center space-x-2.5 cursor-pointer flex-shrink-0" onClick={() => onTabChange('operator')}>
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base font-black tracking-tight gradient-text whitespace-nowrap leading-none">Loan Verification Copilot</h1>
              <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap leading-none">
                FinTech 2026
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium whitespace-nowrap mt-0.5">Intain AI Data Verification Engine</p>
          </div>
        </div>

        {/* Middle Section: Tab Navigation - Perfectly Centered */}
        <nav className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800/90 shadow-inner whitespace-nowrap mx-auto">
          <button
            onClick={() => { onTabChange('operator'); onRoleChange('DATA_OPERATOR'); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === 'operator'
                ? 'bg-gradient-to-r from-sky-500/30 to-indigo-500/30 text-sky-200 border border-sky-500/50 shadow-md shadow-sky-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Data Ingestion</span>
          </button>

          <button
            onClick={() => { onTabChange('reviewer'); onRoleChange('REVIEWER'); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === 'reviewer'
                ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-200 border border-indigo-500/50 shadow-md shadow-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Exception Queue & AI</span>
          </button>

          <button
            onClick={() => { onTabChange('consumer'); onRoleChange('DATA_CONSUMER'); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === 'consumer'
                ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-200 border border-emerald-500/50 shadow-md shadow-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Records & Audit</span>
          </button>

          <button
            onClick={() => { onTabChange('rule-gen'); onRoleChange('RULE_GEN'); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === 'rule-gen'
                ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-200 border border-amber-500/50 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Rule Gen</span>
          </button>

          <button
            onClick={() => { onTabChange('admin'); onRoleChange('ADMIN'); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 border border-purple-500/50 shadow-md shadow-purple-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            <span>System Admin</span>
          </button>
        </nav>

        {/* Right Section: Quality Gauge & Role Switcher */}
        <div className="flex items-center space-x-2.5 flex-shrink-0">
          
          {/* Quality Score */}
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse flex-shrink-0" />
            <div className="text-center flex flex-col items-center">
              <span className="text-[8px] uppercase font-extrabold tracking-wider text-slate-400 leading-none">Quality Score</span>
              <span className="text-xs font-black text-emerald-400 leading-tight mt-0.5">{dqScore.toFixed(1)}%</span>
            </div>
          </div>

          {/* Role Switcher Dropdown */}
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as RoleType)}
              className="bg-slate-900/90 text-xs font-semibold text-slate-200 border border-slate-700 rounded-xl px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer shadow-sm"
            >
              <option value="DATA_OPERATOR">Data Operator</option>
              <option value="REVIEWER">Reviewer</option>
              <option value="DATA_CONSUMER">Data Consumer</option>
              <option value="RULE_GEN">AI Rule Gen</option>
              <option value="ADMIN">System Admin</option>
            </select>
          </div>
        </div>

      </div>
    </header>
  );
};
