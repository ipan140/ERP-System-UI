export interface IActivityLogDto {
  id?: number;
  company_id?: number;
  entity_type: string;
  entity_id: number;
  action: string;
  user_id?: number;
  user_name?: string;
  old_value?: string;
  new_value?: string;
  notes?: string;
  ip_address?: string;
  created_at?: string;
}
