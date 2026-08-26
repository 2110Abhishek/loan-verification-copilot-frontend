import React, { useState, useEffect } from 'react';
import { LoanException, LoanRecord, AiRecommendation } from '../types';
import { CurrencyType, formatCurrency } from '../utils/formatters';
import { 
  fetchExceptions, 
  fetchExceptionDetail, 
  requestAiReview, 
  submitReviewerDecision,
  deleteSingleException,
  bulkDeleteExceptions,
  bulkActionExceptions
} from '../api';
import { 
  AlertCircle, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  ShieldAlert, 
  Cpu, 
  Filter,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';

interface ReviewerDashboardProps {
  onRefreshSummary: () => void;
  currency?: CurrencyType;
}

export const ReviewerDashboard: React.FC<ReviewerDashboardProps> = ({ onRefreshSummary, currency = 'USD' }) => {
  const [exceptions, setExceptions] = useState<LoanException[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('OPEN');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Exception Detail Drawer State
  const [selectedException, setSelectedException] = useState<LoanException | null>(null);
  const [associatedLoan, setAssociatedLoan] = useState<LoanRecord | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<AiRecommendation[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Checkbox Selection State (Single + Select All)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Reviewer Form State
  const [reviewerComment, setReviewerComment] = useState('');
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const [showEditForm, setShowEditForm] = useState(false);

  const loadExceptions = async () => {
    setLoading(true);
    try {
      const data = await fetchExceptions(selectedSeverity || undefined, selectedStatus || undefined, searchQuery || undefined);
      setExceptions(data);
      setSelectedIds([]); // reset selection when queue reloads
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExceptions();
  }, [selectedSeverity, selectedStatus, searchQuery]);

  // Checkbox Select All Toggle
  const isAllSelected = exceptions.length > 0 && selectedIds.length === exceptions.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(exceptions.map((exc) => exc.id));
    }
  };

  // Checkbox Single Row Toggle
  const toggleSelectRow = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening drawer on checkbox click
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectException = async (exc: LoanException) => {
    setSelectedException(exc);
    setReviewerComment('');
    setEditFields({});
    setShowEditForm(false);
    try {
      const detail = await fetchExceptionDetail(exc.id);
      setAssociatedLoan(detail.loan);
      setAiRecommendations(detail.ai_recommendations || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSingle = async (excId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete exception #${excId}?`)) return;

    try {
      await deleteSingleException(excId);
      if (selectedException?.id === excId) {
        setSelectedException(null);
      }
      setSelectedIds(selectedIds.filter((id) => id !== excId));
      onRefreshSummary();
      loadExceptions();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected exceptions?`)) return;

    try {
      await bulkDeleteExceptions(selectedIds);
      if (selectedException && selectedIds.includes(selectedException.id)) {
        setSelectedException(null);
      }
      setSelectedIds([]);
      onRefreshSummary();
      loadExceptions();
    } catch (err: any) {
      alert(err.message || 'Bulk delete failed');
    }
  };

  const handleBulkAction = async (action: 'APPROVE' | 'REJECT') => {
    if (selectedIds.length === 0) return;
    try {
      await bulkActionExceptions(selectedIds, action);
      setSelectedIds([]);
      onRefreshSummary();
      loadExceptions();
    } catch (err: any) {
      alert(err.message || `Bulk ${action} failed`);
    }
  };

  const handleTriggerAiReview = async () => {
    if (!selectedException) return;
    setIsAiLoading(true);
    try {
      const servicerMock = associatedLoan?.loan_id === 'LN-DEMO-001' ? {
        servicer_balance: 242000.0,
        servicer_payment_status: 'DELINQUENT_30',
        update_timestamp: '2025-08-20'
      } : undefined;

      const aiRec = await requestAiReview(selectedException.id, servicerMock);
      setAiRecommendations([aiRec, ...aiRecommendations]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDecision = async (action: 'APPROVE' | 'REJECT' | 'EDIT' | 'REQUEST_CORRECTION', useAi: boolean = false) => {
    if (!selectedException) return;
    try {
      await submitReviewerDecision(selectedException.id, {
        action,
        comments: reviewerComment || (useAi ? 'Accepted AI suggestion' : undefined),
        edited_fields: Object.keys(editFields).length > 0 ? editFields : undefined,
        use_ai_suggestion: useAi,
      });

      onRefreshSummary();
      loadExceptions();

      const detail = await fetchExceptionDetail(selectedException.id);
      setSelectedException(detail.exception);
      setAssociatedLoan(detail.loan);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Module C & D — Exception Queue & AI Assistant</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mt-1.5">Loan Exception Queue</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Review validation rule violations. Select single or multiple entries to delete or approve in bulk.
          </p>
        </div>
        <button
          onClick={loadExceptions}
          className="px-5 py-3 rounded-2xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center space-x-2 transition-all cursor-pointer shadow-md"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Loan ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/90 text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 w-60 shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-900/90 text-xs text-slate-200 border border-slate-700 rounded-xl px-3.5 py-2 outline-none cursor-pointer"
            >
              <option value="">All Severities</option>
              <option value="HIGH">🔴 High</option>
              <option value="MEDIUM">🟠 Medium</option>
              <option value="LOW">🟡 Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-900/90 text-xs text-slate-200 border border-slate-700 rounded-xl px-3.5 py-2 outline-none cursor-pointer"
            >
              <option value="OPEN">Open Exceptions</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
              <option value="IN_REVIEW">In Review</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Total: <span className="text-indigo-400 font-bold">{exceptions.length}</span> exceptions
        </div>

      </div>

      {/* BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/50 bg-indigo-950/40 shadow-xl flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/40">
              Selected: {selectedIds.length} exceptions
            </span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Deselect All
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleBulkAction('APPROVE')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve Selected ({selectedIds.length})</span>
            </button>

            <button
              onClick={() => handleBulkAction('REJECT')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Selected ({selectedIds.length})</span>
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Queue Table (Left) & Loan Detail / AI Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Exception Queue Table */}
        <div className={`${selectedException ? 'lg:col-span-6' : 'lg:col-span-12'} glass-panel rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-4 w-10 text-center">
                    <button
                      onClick={toggleSelectAll}
                      title={isAllSelected ? "Deselect All" : "Select All"}
                      className="text-slate-400 hover:text-indigo-400 focus:outline-none"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-4">Severity</th>
                  <th className="px-4 py-4">Loan ID</th>
                  <th className="px-4 py-4">Rule Name</th>
                  <th className="px-4 py-4">Field</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500 font-medium">Loading queue...</td>
                  </tr>
                ) : exceptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500 font-medium">No matching exceptions found.</td>
                  </tr>
                ) : (
                  exceptions.map((exc) => {
                    const isSelected = selectedException?.id === exc.id;
                    const isChecked = selectedIds.includes(exc.id);

                    return (
                      <tr
                        key={exc.id}
                        onClick={() => handleSelectException(exc)}
                        className={`cursor-pointer transition-all duration-150 ${
                          isSelected 
                            ? 'bg-indigo-950/50 border-l-4 border-indigo-500' 
                            : isChecked 
                            ? 'bg-slate-800/60' 
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={(e) => toggleSelectRow(exc.id, e)}
                            className="text-slate-400 hover:text-indigo-400 focus:outline-none"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-indigo-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            exc.severity === 'HIGH'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : exc.severity === 'MEDIUM'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          }`}>
                            {exc.severity}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-mono font-bold text-slate-100">{exc.loan_id}</td>
                        <td className="px-4 py-4 font-semibold text-slate-200">{exc.rule_name}</td>
                        <td className="px-4 py-4 font-mono text-slate-400">{exc.field_name}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            exc.flag_status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {exc.flag_status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right flex items-center justify-end space-x-2">
                          <button 
                            onClick={(e) => handleDeleteSingle(exc.id, e)}
                            title="Delete this entry"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 border border-rose-500/20 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="text-indigo-400 font-bold hover:underline">
                            Inspect &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Interactive Detail & AI Review Panel */}
        {selectedException && (
          <div className="lg:col-span-6 space-y-6">
            
            {/* Exception Info Header */}
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/40 shadow-2xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-indigo-400 font-bold block">{selectedException.rule_code}</span>
                  <h3 className="text-xl font-black text-white mt-0.5">{selectedException.rule_name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{selectedException.error_message}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleDeleteSingle(selectedException.id, e)}
                    className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 font-bold text-xs"
                    title="Delete exception"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedException(null)}
                    className="text-slate-500 hover:text-slate-200 font-bold text-sm p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Loan Details Grid */}
              {associatedLoan && (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Original Principal:</span>
                    <span className="font-bold text-slate-200">{formatCurrency(associatedLoan.original_principal, currency)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Current Balance:</span>
                    <span className="font-bold text-rose-400">{formatCurrency(associatedLoan.current_balance, currency)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Origination Date:</span>
                    <span className="font-bold text-slate-200">{associatedLoan.origination_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Maturity Date:</span>
                    <span className="font-bold text-slate-200">{associatedLoan.maturity_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Payment Status / DPD:</span>
                    <span className="font-bold text-slate-200">{associatedLoan.payment_status} ({associatedLoan.days_past_due} DPD)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Document Status:</span>
                    <span className="font-bold text-amber-400">{associatedLoan.document_status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* AI Review Assistant Panel */}
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-900/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Exception Review Assistant</h4>
                    <span className="text-[10px] text-indigo-300">Local Copilot Diagnostic Engine</span>
                  </div>
                </div>

                <button
                  onClick={handleTriggerAiReview}
                  disabled={isAiLoading}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold gradient-button text-white flex items-center space-x-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  {isAiLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Analyze Exception with AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Recommendation Output */}
              {aiRecommendations.length > 0 ? (
                <div className="space-y-4 pt-2">
                  {aiRecommendations.map((aiRec) => (
                    <div key={aiRec.id} className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/40 space-y-4 text-xs shadow-md">
                      
                      <div>
                        <span className="text-indigo-400 font-bold uppercase tracking-wider block text-[10px]">Root Cause Explanation</span>
                        <p className="text-slate-200 mt-1 leading-relaxed">{aiRec.explanation}</p>
                      </div>

                      {aiRec.suggested_value && (
                        <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-between">
                          <div>
                            <span className="text-slate-400 block text-[10px] font-medium">Suggested Correction ({aiRec.suggested_field}):</span>
                            <span className="font-mono font-bold text-emerald-400 text-sm">
                              {aiRec.suggested_field?.includes('balance') || aiRec.suggested_field?.includes('principal')
                                ? formatCurrency(aiRec.suggested_value, currency)
                                : aiRec.suggested_value}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDecision('APPROVE', true)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer transition-all"
                          >
                            Accept AI Suggestion
                          </button>
                        </div>
                      )}

                      {/* AI Audit Metadata Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                        <span>Model: <strong className="text-slate-200">{aiRec.model_name}</strong></span>
                        <span>Confidence: <strong className="text-emerald-400">{Math.round(aiRec.confidence_score * 100)}%</strong></span>
                        <span>Time: <strong className="text-slate-200">{aiRec.execution_time_ms}ms</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
                  Click <strong className="text-indigo-300">"Analyze Exception with AI"</strong> to generate diagnostic notes, compare servicer data, and review suggested corrections.
                </div>
              )}
            </div>

            {/* Human Reviewer Action Controls */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 shadow-2xl space-y-4">
              <h4 className="text-sm font-bold text-white">Reviewer Decision & Action Control</h4>
              
              <div className="space-y-4">
                <textarea
                  placeholder="Enter reviewer audit notes / comments..."
                  value={reviewerComment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewerComment(e.target.value)}
                  className="w-full bg-slate-900/90 text-xs text-slate-200 p-4 rounded-2xl border border-slate-700 focus:outline-none focus:border-indigo-500 h-24 font-sans shadow-inner"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleDecision('APPROVE', false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center space-x-2 cursor-pointer transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve Loan</span>
                  </button>

                  <button
                    onClick={() => handleDecision('REJECT', false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 flex items-center space-x-2 cursor-pointer transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Loan</span>
                  </button>

                  <button
                    onClick={() => handleDecision('REQUEST_CORRECTION', false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 flex items-center space-x-2 cursor-pointer transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Request Correction</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
