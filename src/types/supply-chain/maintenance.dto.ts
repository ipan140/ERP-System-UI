export interface IMaintenanceSummary {
  total_requests: number;
  todo_count: number;
  in_progress_count: number;
  done_count: number;
  total_equipments: number;
}

export interface IMaintenanceEquipmentDto {
  id?: number;
  name: string;
  category?: string;
  workcenter_id?: number;
  workcenter?: any;
  cost?: number;
  next_action_date?: string;
  created_at?: string;
}

export interface IMaintenanceRequestDto {
  id?: number;
  name: string;
  code?: string;
  equipment_id: number;
  equipment?: IMaintenanceEquipmentDto;
  type: 'corrective' | 'preventive' | string;
  priority: 'low' | 'normal' | 'high' | 'urgent' | string;
  state: 'todo' | 'progress' | 'done' | 'cancel' | string;
  schedule_date?: string;
  duration?: number;
  notes?: string;
  date_done?: string;
  created_at?: string;
}

export interface ICreateMaintenanceRequestPayload {
  name: string;
  equipment_id: number;
  type: string;
  priority?: string;
  schedule_date?: string;
  duration?: number;
  notes?: string;
}

export interface IUpdateMaintenanceStatePayload {
  state: 'todo' | 'progress' | 'done' | 'cancel';
  duration?: number;
  notes?: string;
}

export interface ICreateMaintenanceEquipmentPayload {
  name: string;
  category?: string;
  workcenter_id?: number;
  cost?: number;
  next_action_date?: string;
}

