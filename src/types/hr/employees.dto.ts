export interface IContractDto {
  created_at?: string;
  employee?: any;
  employee_id?: number;
  is_active?: boolean;
  end_date?: string;
  id?: number;
  job_position?: IJobPositionDto;
  job_position_id?: number;
  start_date?: string;
  state?: string;
  wage?: number;
  working_schedule?: IWorkingScheduleDto;
  working_schedule_id?: number;
}

export interface IDepartmentDto {
  created_at?: string;
  id?: number;
  manager?: any;
  manager_id?: number;
  name?: string;
  parent?: IDepartmentDto;
  parent_id?: number;
}

export interface IEmployeeDto {
  is_active?: boolean;
  created_at?: string;
  department?: IDepartmentDto;
  department_id?: number;
  emergency_contact?: string;
  emergency_phone?: string;
  id?: number;
  job_position?: IJobPositionDto;
  job_position_id?: number;
  manager?: any;
  manager_id?: number;
  name?: string;
  user?: any;
  user_id?: number;
  work_email?: string;
  work_phone?: string;
}

export interface IEmployeeSkillDto {
  employee?: any;
  employee_id?: number;
  id?: number;
  skill?: ISkillDto;
  skill_id?: number;
  skill_level?: ISkillLevelDto;
  skill_level_id?: number;
}

export interface IJobPositionDto {
  created_at?: string;
  department?: IDepartmentDto;
  department_id?: number;
  id?: number;
  name?: string;
  state?: string;
}

export interface IResumeLineDto {
  date_end?: string;
  date_start?: string;
  description?: string;
  employee?: any;
  employee_id?: number;
  id?: number;
  title?: string;
  type?: string;
}

export interface ISkillDto {
  id?: number;
  name?: string;
}

export interface ISkillLevelDto {
  id?: number;
  name?: string;
  skill?: ISkillDto;
  skill_id?: number;
}

export interface IWorkingScheduleDto {
  created_at?: string;
  hours_per_week?: number;
  id?: number;
  name?: string;
}
