export interface IAccountIncotermsDto {
  code?: string;
  id?: number;
  name?: string;
}

export interface IAccountLockDateDto {
  company_id?: number;
  fiscal_year_lock_date?: string;
  id?: number;
  tax_lock_date?: string;
}

export interface IAccountReconcileModelDto {
  account_id?: number;
  amount_type?: string;
  amount_value?: number;
  id?: number;
  match_text?: string;
  name?: string;
}

export interface IFollowupRuleDto {
  delay_days?: number;
  id?: number;
  name?: string;
  send_email?: boolean;
  send_letter?: boolean;
}

export interface IJournalEntryDto {
  created_at?: string;
  date?: string;
  id?: number;
  journal_id?: number;
  name?: string;
  state?: string;
}

export interface IPaymentAcquirerDto {
  api_key?: string;
  id?: number;
  name?: string;
  provider?: string;
  state?: string;
}

export interface IPaymentTransactionDto {
  acquirer_id?: number;
  amount?: number;
  created_at?: string;
  gateway_transaction_id?: string;
  id?: number;
  invoice_id?: number;
  partner_id?: number;
  reference?: string;
  state?: string;
}
