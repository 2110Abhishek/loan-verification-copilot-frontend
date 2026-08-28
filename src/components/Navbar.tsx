import React, { useState } from 'react';
import { RoleType } from '../types';
import { ShieldCheck, UserCheck, Database, Cpu, Sparkles, Activity, Settings, Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: string, role: RoleType) => {
    onTabChange(tab);
    onRoleChange(role);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 sm:px-8 py-3 mb-6 sm:mb-8 shadow-2xl">
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Section: Brand & System Title */}
        <div className="flex items-center space-x-2.5 cursor-pointer flex-shrink-0" onClick={() => handleTabClick('operator', 'DATA_OPERATOR')}>
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/30">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-sm sm:text-base font-black tracking-tight gradient-text whitespace-nowrap leading-none">Loan Verification Copilot</h1>
              <span className="hidden xs:inline-block px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap leading-none">
                FinTech 2026
              </span>
            </div>
            <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium whitespace-nowrap mt-0.5">Intain AI Data Verification Engine</p>
          </div>
        </div>

        {/* Middle Section: Desktop Tab Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800/90 shadow-inner whitespace-nowrap mx-auto">
          <button
            onClick={() => handleTabClick('operator', 'DATA_OPERATOR')}
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
            onClick={() => handleTabClick('reviewer', 'REVIEWER')}
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
            onClick={() => handleTabClick('consumer', 'DATA_CONSUMER')}
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
            onClick={() => handleTabClick('rule-gen', 'RULE_GEN')}
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
            onClick={() => handleTabClick('admin', 'ADMIN')}
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

        {/* Right Section: Quality Gauge, Role Switcher & Mobile Menu Button */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
          
          {/* Quality Score */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-2.5 py-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
            <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 animate-pulse flex-shrink-0" />
            <div className="text-center flex flex-col items-center">
              <span className="text-[7px] sm:text-[8px] uppercase font-extrabold tracking-wider text-slate-400 leading-none">Quality Score</span>
              <span className="text-[11px] sm:text-xs font-black text-emerald-400 leading-tight mt-0.5">{dqScore.toFixed(1)}%</span>
            </div>
          </div>

          {/* Role Switcher Dropdown */}
          <div className="hidden sm:flex items-center space-x-1 pl-2 border-l border-slate-800">
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

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Horizontally Scrollable Tab Bar (Always Visible on Mobile/Tablet) */}
      <div className="lg:hidden mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar flex items-center space-x-1.5 pb-1">
        <button
          onClick={() => handleTabClick('operator', 'DATA_OPERATOR')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
            activeTab === 'operator'
              ? 'bg-gradient-to-r from-sky-500/30 to-indigo-500/30 text-sky-200 border border-sky-500/50'
              : 'text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span>Ingestion</span>
        </button>

        <button
          onClick={() => handleTabClick('reviewer', 'REVIEWER')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
            activeTab === 'reviewer'
              ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-200 border border-indigo-500/50'
              : 'text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Exceptions & AI</span>
        </button>

        <button
          onClick={() => handleTabClick('consumer', 'DATA_CONSUMER')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
            activeTab === 'consumer'
              ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-200 border border-emerald-500/50'
              : 'text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified & Audit</span>
        </button>

        <button
          onClick={() => handleTabClick('rule-gen', 'RULE_GEN')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
            activeTab === 'rule-gen'
              ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-200 border border-amber-500/50'
              : 'text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Rule Gen</span>
        </button>

        <button
          onClick={() => handleTabClick('admin', 'ADMIN')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
            activeTab === 'admin'
              ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 border border-purple-500/50'
              : 'text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-purple-400" />
          <span>Admin</span>
        </button>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-4 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl space-y-3 animate-fade-in">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Switch Role / Navigation</div>
          
          <div className="sm:hidden mb-3 pb-3 border-b border-slate-800">
            <label className="text-xs text-slate-400 block mb-1 font-medium">Select Persona Role:</label>
            <select
              value={currentRole}
              onChange={(e) => { onRoleChange(e.target.value as RoleType); setMobileMenuOpen(false); }}
              className="w-full bg-slate-900 text-xs font-semibold text-slate-200 border border-slate-700 rounded-xl px-3 py-2 outline-none"
            >
              <option value="DATA_OPERATOR">Data Operator</option>
              <option value="REVIEWER">Reviewer</option>
              <option value="DATA_CONSUMER">Data Consumer</option>
              <option value="RULE_GEN">AI Rule Gen</option>
              <option value="ADMIN">System Admin</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleTabClick('operator', 'DATA_OPERATOR')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left ${
                activeTab === 'operator' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Database className="w-4 h-4 text-sky-400" />
              <span>Data Ingestion Dashboard</span>
            </button>

            <button
              onClick={() => handleTabClick('reviewer', 'REVIEWER')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left ${
                activeTab === 'reviewer' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Exception Queue & AI Assistant</span>
            </button>

            <button
              onClick={() => handleTabClick('consumer', 'DATA_CONSUMER')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left ${
                activeTab === 'consumer' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Records & Audit Lineage</span>
            </button>

            <button
              onClick={() => handleTabClick('rule-gen', 'RULE_GEN')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left ${
                activeTab === 'rule-gen' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Rule Generator Workspace</span>
            </button>

            <button
              onClick={() => handleTabClick('admin', 'ADMIN')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left ${
                activeTab === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Settings className="w-4 h-4 text-purple-400" />
              <span>System Admin Console</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
