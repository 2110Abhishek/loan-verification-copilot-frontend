import { SystemSummary, LoanRecord, LoanException, VerifiedLoan, AuditLog, AiRecommendation } from './types';

const API_BASE = '/api';

export async function uploadCSVFile(file: File, uploadedBy: string = 'usr_op_01') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploaded_by', uploadedBy);
  formData.append('run_validation_now', 'true');

  const res = await fetch(`${API_BASE}/ingest/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Upload failed');
  }

  return res.json();
}

export async function clearAllIngestedData() {
  const res = await fetch(`${API_BASE}/ingest/clear-all`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed clearing system data');
  return res.json();
}

export async function fetchSystemSummary(): Promise<SystemSummary> {
  const res = await fetch(`${API_BASE}/summary`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

export async function fetchValidationRules() {
  const res = await fetch(`${API_BASE}/rules`);
  if (!res.ok) throw new Error('Failed to fetch validation rules');
  return res.json();
}

export async function toggleValidationRule(ruleCode: string) {
  const res = await fetch(`${API_BASE}/rules/${ruleCode}/toggle`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Failed to toggle rule ${ruleCode}`);
  return res.json();
}

export async function fetchLoans(status?: string, search?: string): Promise<LoanRecord[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/loans?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch loans');
  return res.json();
}

export async function fetchLoanDetail(loanId: string) {
  const res = await fetch(`${API_BASE}/loans/${loanId}`);
  if (!res.ok) throw new Error('Failed to fetch loan detail');
  return res.json();
}

export async function fetchExceptions(severity?: string, flagStatus?: string, search?: string): Promise<LoanException[]> {
  const params = new URLSearchParams();
  if (severity) params.append('severity', severity);
  if (flagStatus) params.append('flag_status', flagStatus);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/exceptions?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch exceptions');
  return res.json();
}

export async function fetchExceptionDetail(exceptionId: number) {
  const res = await fetch(`${API_BASE}/exceptions/${exceptionId}`);
  if (!res.ok) throw new Error('Failed to fetch exception detail');
  return res.json();
}

export async function deleteSingleException(exceptionId: number) {
  const res = await fetch(`${API_BASE}/exceptions/${exceptionId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed deleting exception ${exceptionId}`);
  return res.json();
}

export async function bulkDeleteExceptions(ids: number[]) {
  const res = await fetch(`${API_BASE}/exceptions/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error('Failed bulk deleting exceptions');
  return res.json();
}

export async function bulkActionExceptions(ids: number[], action: 'APPROVE' | 'REJECT' | 'DELETE') {
  const res = await fetch(`${API_BASE}/exceptions/bulk-action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, action }),
  });
  if (!res.ok) throw new Error(`Failed bulk ${action}`);
  return res.json();
}

export async function requestAiReview(exceptionId: number, servicerUpdate?: any): Promise<AiRecommendation> {
  const res = await fetch(`${API_BASE}/ai/exceptions/${exceptionId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(servicerUpdate || {}),
  });
  if (!res.ok) throw new Error('AI Review generation failed');
  return res.json();
}

export async function submitReviewerDecision(
  exceptionId: number,
  payload: {
    action: 'APPROVE' | 'REJECT' | 'EDIT' | 'REQUEST_CORRECTION';
    reviewer_id?: string;
    reviewer_role?: string;
    comments?: string;
    edited_fields?: Record<string, any>;
    use_ai_suggestion?: boolean;
  }
) {
  const res = await fetch(`${API_BASE}/exceptions/${exceptionId}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reviewer_id: 'usr_rev_01',
      reviewer_role: 'REVIEWER',
      ...payload,
    }),
  });
  if (!res.ok) throw new Error('Failed to submit reviewer decision');
  return res.json();
}

export async function fetchVerifiedLoans(search?: string): Promise<VerifiedLoan[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/verified-loans?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch verified loans');
  return res.json();
}

export async function fetchAuditLogs(loanId?: string): Promise<AuditLog[]> {
  const url = loanId ? `${API_BASE}/audit/${loanId}` : `${API_BASE}/audit`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function generateNaturalLanguageRule(promptText: string) {
  const res = await fetch(`${API_BASE}/ai/generate-rule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ natural_language_prompt: promptText }),
  });
  if (!res.ok) throw new Error('Failed to generate rule');
  return res.json();
}
