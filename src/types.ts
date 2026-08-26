export type RoleType = 'DATA_OPERATOR' | 'REVIEWER' | 'DATA_CONSUMER' | 'RULE_GEN' | 'ADMIN';

export interface LoanRecord {
  id: number;
  loan_id: string | null;
  borrower_id: string | null;
  loan_type: string | null;
  origination_date: string | null;
  maturity_date: string | null;
  original_principal: number | null;
  current_balance: number | null;
  interest_rate: number | null;
  term_months: number | null;
  borrower_state: string | null;
  loan_purpose: string | null;
  credit_grade: string | null;
  employment_length: string | null;
  income_band: string | null;
  payment_status: string | null;
  days_past_due: number;
  servicer_name: string | null;
  last_payment_date: string | null;
  last_updated_at: string | null;
  document_status: string | null;
  source_system: string;
  validation_status: 'PASSED' | 'FAILED' | 'PENDING';
  created_at: string;
  updated_at: string;
}

export interface LoanException {
  id: number;
  loan_id: string | null;
  rule_code: string;
  rule_name: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  error_message: string;
  field_name: string;
  flag_status: 'OPEN' | 'RESOLVED' | 'REJECTED' | 'IN_REVIEW';
  raw_value: string | null;
  suggested_value: string | null;
  reviewer_notes: string | null;
  created_at: string;
}

export interface AiRecommendation {
  id: number;
  exception_id: number;
  loan_id: string | null;
  explanation: string;
  suggested_value: string | null;
  suggested_field: string | null;
  confidence_score: number;
  prompt_text: string | null;
  model_name: string;
  execution_time_ms: number;
  applied_status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EDITED';
  created_at: string;
}

export interface VerifiedLoan {
  id: number;
  loan_id: string;
  canonical_data: Record<string, any>;
  source_file_ref: string;
  validation_result: string;
  reviewer_decision: string;
  ai_recommendation_used: boolean;
  verified_at: string;
  verified_by: string;
  record_hash: string;
}

export interface AuditLog {
  id: number;
  event_type: string;
  loan_id: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  actor_role?: string;
  actor_id?: string;
  description?: string;
  performed_by?: string;
  changes?: Record<string, any> | null;
  metadata_info?: Record<string, any> | null;
  timestamp: string;
}

export interface SystemSummary {
  data_quality_score: number;
  pipeline_metrics: {
    total_uploads: number;
    total_records_ingested: number;
    passed_loans: number;
    failed_loans: number;
    pending_loans: number;
    verified_records_count: number;
  };
  exception_metrics: {
    total_exceptions: number;
    open_exceptions: number;
    resolved_exceptions: number;
    by_severity: {
      HIGH: number;
      MEDIUM: number;
      LOW: number;
    };
  };
}
