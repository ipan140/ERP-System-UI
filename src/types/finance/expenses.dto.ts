export interface IExpenseDto {
  created_at?: string;
  employee?: any;
  employee_id?: number;
  expenseSheet?: any;
  expense_sheet_id?: number;
  id?: number;
  name?: string;
  state?: string;
  total_amount?: number;
}

export interface IExpenseSheetDto {
  created_at?: string;
  employee?: any;
  employee_id?: number;
  id?: number;
  name?: string;
  state?: string;
  total?: number;
}
