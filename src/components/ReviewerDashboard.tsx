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
  Square,
  X
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
    e.stopPropagation();
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
    if (!selectedIds.length) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected exception(s)?`)) return;

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
    if (!selectedIds.length) return;
    if (!window.confirm(`Perform bulk ${action} on ${selectedIds.length} item(s)?`)) return;

    try {
      await bulkActionExceptions(selectedIds, action);
      setSelectedIds([]);
      onRefreshSummary();
      loadExceptions();
    } catch (err: any) {
      alert(err.message || `Bulk ${action} failed`);
    }
  };

  const handleRequestAi = async () => {
    if (!selectedException) return;
    setIsAiLoading(true);
    try {
      const rec = await requestAiReview(selectedException.id);
      setAiRecommendations([rec, ...aiRecommendations]);
    } catch (err: any) {
      alert(err.message || 'AI request failed');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDecision = async (
    action: 'APPROVE' | 'REJECT' | 'EDIT' | 'REQUEST_CORRECTION',
    useAi: boolean = false
  ) => {
    if (!selectedException) return;

    try {
      await submitReviewerDecision(selectedException.id, {
        action,
        comments: reviewerComment,
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
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Module C & D — Exception Queue & AI Assistant</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">Loan Exception Queue</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Review validation rule violations. Select single or multiple entries to delete or approve in bulk.
          </p>
        </div>
        <button
          onClick={loadExceptions}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800/80 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Loan ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/90 text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 w-full shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full sm:w-auto bg-slate-900/90 text-xs text-slate-200 border border-slate-700 rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="">All Severities</option>
              <option value="HIGH">🔴 High</option>
              <option value="MEDIUM">🟠 Medium</option>
              <option value="LOW">🟡 Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto bg-slate-900/90 text-xs text-slate-200 border border-slate-700 rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="OPEN">Open Exceptions</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
              <option value="IN_REVIEW">In Review</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono text-right sm:text-left">
          Total: <span className="text-indigo-400 font-bold">{exceptions.length}</span> exceptions
        </div>

      </div>

      {/* BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/50 bg-indigo-950/40 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center justify-between sm:justify-start space-x-3">
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

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleBulkAction('APPROVE')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve Selected ({selectedIds.length})</span>
            </button>

            <button
              onClick={() => handleBulkAction('REJECT')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Selected ({selectedIds.length})</span>
            </button>

            <button
              onClick={handleBulkDelete}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid Layout: Exception Table + AI Reviewer Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Exception Queue Table */}
        <div className={`space-y-4 ${selectedException ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          <div className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl">
            <div className="overflow-x-auto max-h-[600px] no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-md text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4 w-10 text-center">
                      <button 
                        onClick={toggleSelectAll} 
                        className="text-slate-400 hover:text-white transition-colors"
                        title={isAllSelected ? "Deselect All" : "Select All"}
                      >
                        {isAllSelected ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4" />}
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
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {exceptions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        {loading ? 'Loading exception queue...' : 'No exceptions found matching filters.'}
                      </td>
                    </tr>
                  ) : (
                    exceptions.map((exc) => {
                      const isSelected = selectedException?.id === exc.id;
                      const isRowChecked = selectedIds.includes(exc.id);

                      return (
                        <tr 
                          key={exc.id}
                          onClick={() => handleSelectException(exc)}
                          className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                            isSelected ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : ''
                          } ${isRowChecked ? 'bg-indigo-950/20' : ''}`}
                        >
                          <td className="p-4 text-center">
                            <button 
                              onClick={(e) => toggleSelectRow(exc.id, e)} 
                              className="text-slate-400 hover:text-white transition-colors"
                            >
                              {isRowChecked ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4" />}
                            </button>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
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
                          <td className="px-4 py-4 font-mono font-bold text-slate-100 whitespace-nowrap">{exc.loan_id}</td>
                          <td className="px-4 py-4 font-semibold text-slate-200">{exc.rule_name}</td>
                          <td className="px-4 py-4 font-mono text-slate-400 whitespace-nowrap">{exc.field_name}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              exc.flag_status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {exc.flag_status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right whitespace-nowrap flex items-center justify-end space-x-2">
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
        </div>

        {/* Right Column: Interactive Detail & AI Review Panel */}
        {selectedException && (
          <div className="lg:col-span-6 space-y-6">
            
            {/* Exception Info Header */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-indigo-500/40 shadow-2xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-indigo-400 font-bold block">{selectedException.rule_code}</span>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">{selectedException.rule_name}</h3>
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
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Loan Overview Grid */}
              {associatedLoan && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Original Principal</span>
                    <span className="font-mono text-slate-200 font-bold">
                      {formatCurrency(associatedLoan.original_principal, currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Current Balance</span>
                    <span className="font-mono text-rose-400 font-bold">
                      {formatCurrency(associatedLoan.current_balance, currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Origination Date</span>
                    <span className="font-mono text-slate-300">{associatedLoan.origination_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Maturity Date</span>
                    <span className="font-mono text-slate-300">{associatedLoan.maturity_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Payment Status / DPD</span>
                    <span className="font-mono text-slate-300">{associatedLoan.payment_status} ({associatedLoan.days_past_due} DPD)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Document Status</span>
                    <span className="font-mono text-amber-400 font-bold">{associatedLoan.document_status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* AI Review Assistant Panel */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/30 to-slate-900/90 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
                    <Sparkles className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white tracking-wide">AI Exception Review Assistant</h4>
                    <p className="text-[10px] text-slate-400">Local Copilot Diagnostic Engine</p>
                  </div>
                </div>

                <button
                  onClick={handleRequestAi}
                  disabled={isAiLoading}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? 'Analyzing...' : 'Analyze Exception with AI'}</span>
                </button>
              </div>

              {/* AI Recommendations List */}
              {aiRecommendations.length > 0 && (
                <div className="space-y-4 pt-2">
                  {aiRecommendations.map((rec) => (
                    <div key={rec.id} className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400 block mb-1">
                          Root Cause Explanation
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          {rec.explanation}
                        </p>
                      </div>

                      {rec.suggested_value && (
                        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                              Suggested Correction ({rec.suggested_field})
                            </span>
                            <span className="font-mono text-xs font-black text-emerald-300">
                              {rec.suggested_value}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDecision('APPROVE', true)}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 cursor-pointer"
                          >
                            Accept AI Suggestion
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 border-t border-slate-800 pt-2.5 gap-2">
                        <span>Model: <strong className="text-slate-400 font-mono">{rec.model_name}</strong></span>
                        <span>Confidence: <strong className="text-emerald-400">{(rec.confidence_score * 100).toFixed(0)}%</strong></span>
                        <span>Time: <strong className="text-slate-400 font-mono">{rec.execution_time_ms}ms</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Human Reviewer Action Controls */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800/90 shadow-2xl space-y-4">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Human Reviewer Decision</span>
              </h4>

              <textarea
                rows={2}
                placeholder="Add reviewer notes or audit rationale..."
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                className="w-full bg-slate-900 text-xs text-slate-200 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 shadow-inner"
              />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleDecision('APPROVE', false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Loan</span>
                </button>

                <button
                  onClick={() => handleDecision('REJECT', false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Loan</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
