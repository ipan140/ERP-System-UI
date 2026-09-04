export interface IExpenseDto {
  id: number;
  name: string;
  employee_id: number;
  employee?: any;
  expenseSheet?: any;
  expense_sheet_id?: number;
  total_amount: number;
  state: string;
  created_at: string;
}

export interface IExpenseSheetDto {
  id: number;
  name: string;
  employee_id: number;
  employee?: any;
  total: number;
  state: string;
  created_at: string;
}

export interface IPettyCashFundDto {
  id: number;
  name: string;
  custodian: string;
  plafond_limit: number;
  current_balance: number;
  gl_account_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface IPettyCashTransactionDto {
  id: number;
  fund_id: number;
  tx_type: 'expense' | 'replenish';
  amount: number;
  description: string;
  receipt_ref?: string;
  recorded_by: string;
  created_at?: string;
}
