export interface IBankStatementItemDto {
  id: number;
  date: string;
  description: string;
  ref_number?: string;
  debit: number;
  credit: number;
  bank_name?: string;
  is_reconciled: boolean;
  matched_invoice?: string;
  created_at?: string;
}

export interface IAssetCategoryDto {
  id: number;
  code: string;
  name: string;
  default_useful_life: number;
  gl_account_debit?: string;
  gl_account_credit?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IFixedAssetDto {
  id: number;
  code: string;
  name: string;
  category: string;
  acquisition_date?: string;
  acquisition_cost: number;
  useful_life_months: number;
  residual_value: number;
  depreciation_method: string;
  monthly_depreciation: number;
  accumulated_depreciation: number;
  net_book_value: number;
  status: string;
  created_at?: string;
}

export interface IDepartmentBudgetDto {
  id: number;
  department_name: string;
  fiscal_period: string;
  allocated_limit: number;
  realized_spent: number;
  remaining_budget: number;
  usage_percent: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ITaxMasterConfigDto {
  id: number;
  tax_code: string;
  tax_name: string;
  rate: number;
  legal_basis?: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ITaxReportSummaryDto {
  id: number;
  tax_period: string;
  tax_type: string;
  tax_base: number;
  tax_rate: number;
  tax_amount: number;
  partner_name: string;
  npwp: string;
  status: string;
  created_at?: string;
}
