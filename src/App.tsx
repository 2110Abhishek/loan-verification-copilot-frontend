import React, { useState, useEffect } from 'react';
import { RoleType, SystemSummary } from './types';
import { fetchSystemSummary } from './api';
import { Navbar } from './components/Navbar';
import { DataOperatorDashboard } from './components/DataOperatorDashboard';
import { ReviewerDashboard } from './components/ReviewerDashboard';
import { DataConsumerDashboard } from './components/DataConsumerDashboard';
import { AiRuleGenerator } from './components/AiRuleGenerator';
import { AdminDashboard } from './components/AdminDashboard';

export function App() {
  const [currentRole, setCurrentRole] = useState<RoleType>('DATA_OPERATOR');
  const [activeTab, setActiveTab] = useState<string>('operator');
  const [summary, setSummary] = useState<SystemSummary | null>(null);

  const loadSummary = async () => {
    try {
      const data = await fetchSystemSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed fetching system summary', err);
    }
  };

  useEffect(() => {
    loadSummary();
    const interval = setInterval(loadSummary, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = (role: RoleType) => {
    setCurrentRole(role);
    if (role === 'DATA_OPERATOR') setActiveTab('operator');
    else if (role === 'REVIEWER') setActiveTab('reviewer');
    else if (role === 'DATA_CONSUMER') setActiveTab('consumer');
    else if (role === 'ADMIN') setActiveTab('admin');
    else if (role === 'RULE_GEN') setActiveTab('rule-gen');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dqScore={summary?.data_quality_score || 100.0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12">
        {activeTab === 'operator' && (
          <DataOperatorDashboard
            onNavigateToReviewer={() => { setActiveTab('reviewer'); setCurrentRole('REVIEWER'); }}
            onRefreshSummary={loadSummary}
            currency="INR"
          />
        )}

        {activeTab === 'reviewer' && (
          <ReviewerDashboard onRefreshSummary={loadSummary} currency="INR" />
        )}

        {activeTab === 'consumer' && (
          <DataConsumerDashboard dqScore={summary?.data_quality_score || 100.0} />
        )}

        {activeTab === 'rule-gen' && (
          <AiRuleGenerator />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard onRefreshSummary={loadSummary} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 glass-panel">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 px-4 sm:px-8">
          <span>Intain Campus FinTech Challenge 2026 — Full Stack Track</span>
          <span className="font-mono">Loan Data Verification Copilot v1.0.0</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
