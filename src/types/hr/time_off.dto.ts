export interface ILeaveAllocationDto {
  created_at?: string;
  employee?: any;
  employee_id?: number;
  id?: number;
  leaveType?: any;
  leave_type_id?: number;
  number_of_days?: number;
  state?: string;
}

export interface ILeaveRequestDto {
  created_at?: string;
  employee?: any;
  employee_id?: number;
  end_date?: string;
  hr_approve_id?: number;
  hrapprove?: any;
  id?: number;
  leaveType?: any;
  leave_type_id?: number;
  manager_approve_id?: number;
  managerapprove?: any;
  number_of_days?: number;
  start_date?: string;
  status?: string;
}

export interface ILeaveTypeDto {
  created_at?: string;
  id?: number;
  name?: string;
  requires_approval?: boolean;
}
