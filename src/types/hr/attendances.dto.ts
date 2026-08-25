export interface IAttendanceDto {
  check_in?: string;
  check_out?: string;
  created_at?: string;
  employee?: any;
  employee_id?: number;
  id?: number;
  worked_hours?: number;
}

export interface IOvertimeDto {
  created_at?: string;
  date?: string;
  employee?: any;
  employee_id?: number;
  hours?: number;
  id?: number;
  state?: string;
}
