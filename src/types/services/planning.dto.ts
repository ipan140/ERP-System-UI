export interface IShiftDto {
  id?: number;
  name?: string;
  employee_id?: number;
  employee?: any;
  role?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  hours?: number;
  state?: 'draft' | 'published' | 'completed' | string;
  notes?: string;
  created_at?: string;
}

