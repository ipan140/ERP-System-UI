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
