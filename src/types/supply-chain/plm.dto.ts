export interface IPlmEcoTypeDto {
  id: number;
  name: string;
}

export interface IPlmSummary {
  total_eco: number;
  draft_count: number;
  progress_count: number;
  approved_count: number;
  done_count: number;
}

export interface IPlmEcoDto {
  id?: number;
  code?: string;
  name: string;
  type_id: number;
  type?: IPlmEcoTypeDto;
  product_id: number;
  product?: any;
  old_bom_id?: number;
  old_bom?: any;
  new_bom_id?: number;
  new_bom?: any;
  reason?: string;
  effective_date?: string;
  state?: 'draft' | 'progress' | 'approved' | 'done' | 'cancel' | string;
  approver_id?: number;
  approved_at?: string;
  created_at?: string;
}

export interface ICreateEcoPayload {
  name: string;
  type_id: number;
  product_id: number;
  old_bom_id?: number;
  new_bom_id?: number;
  reason?: string;
  effective_date?: string;
}

export interface IUpdateEcoStatePayload {
  state: 'draft' | 'progress' | 'approved' | 'done' | 'cancel';
  notes?: string;
}
