export interface IMaintenanceEquipmentDto {
  category?: string;
  cost?: number;
  created_at?: string;
  id?: number;
  name?: string;
  next_action_date?: string;
  workcenter?: any;
  workcenter_id?: number;
}

export interface IMaintenanceRequestDto {
  created_at?: string;
  duration?: number;
  equipment?: any;
  equipment_id?: number;
  id?: number;
  name?: string;
  schedule_date?: string;
  state?: string;
  type?: string;
}
