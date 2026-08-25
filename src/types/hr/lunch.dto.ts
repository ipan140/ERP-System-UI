export interface ILunchCashmoveDto {
  amount?: number;
  date?: string;
  description?: string;
  employee?: any;
  employee_id?: number;
  id?: number;
}

export interface ILunchOrderDto {
  created_at?: string;
  date?: string;
  employee?: any;
  employee_id?: number;
  id?: number;
  state?: string;
  total?: number;
}
