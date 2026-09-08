export interface IChecklistItem {
  id?: string;
  title: string;
  done: boolean;
}

export interface IFieldServiceTaskDto {
  id?: number;
  name?: string;
  partner_id?: number;
  partner?: any;
  employee_id?: number;
  employee?: any;
  scheduled_date?: string;
  address?: string;
  priority?: string;
  state?: string;
  notes?: string;
  checklist?: IChecklistItem[];
  signature?: string;
  created_at?: string;
}

