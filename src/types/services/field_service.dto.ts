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
  bast_validated?: boolean;
  validated_by_id?: number;
  validated_at?: string;

  // Fase 4: GPS Geotagging
  check_in_lat?: number;
  check_in_lng?: number;
  check_in_at?: string;
  check_out_lat?: number;
  check_out_lng?: number;
  check_out_at?: string;

  created_at?: string;
}


