export interface ITimesheetDto {
  cost?: number;
  created_at?: string;
  date?: string;
  description?: string;
  employee?: any;
  employee_id?: number;
  hours?: number;
  id?: number;
  is_billable?: boolean;
  project?: any;
  project_id?: number;
  task?: any;
  task_id?: number;
  status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'invoiced';
  approved_by_id?: number;
  approved_at?: string;
  rejection_reason?: string;
}
