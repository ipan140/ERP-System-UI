export interface IProjectDto {
  created_at?: string;
  customer?: any;
  customer_id?: number;
  id?: number;
  manager?: any;
  manager_id?: number;
  name?: string;
  sale_order_id?: number;
  state?: string;
}

export interface IProjectMilestoneDto {
  id?: number;
  invoice_percentage?: number;
  is_reached?: boolean;
  name?: string;
  project?: any;
  project_id?: number;
}

export interface IResourceForecastDto {
  employee?: any;
  employee_id?: number;
  end_date?: string;
  hours_per_week?: number;
  id?: number;
  project?: any;
  project_id?: number;
  start_date?: string;
}

export interface ITaskDto {
  assignee?: any;
  assignee_id?: number;
  created_at?: string;
  customer_signature?: string;
  deadline?: string;
  id?: number;
  name?: string;
  project?: any;
  project_id?: number;
  required_skill_id?: number;
  requiredskill?: any;
  stage?: string;
}

export interface ITaskDependencyDto {
  blocks_task_id?: number;
  blockstask?: any;
  id?: number;
  task?: any;
  task_id?: number;
}
