export interface IMrpSummaryDto {
  total_mo_count: number;
  mo_in_progress: number;
  mo_done_count: number;
  total_workcenters: number;
  total_boms: number;
}

export interface IMrpBomDto {
  code?: string;
  id?: number;
  product?: any;
  product_id?: number;
  quantity?: number;
  type?: string;
  bom_lines?: IMrpBomLineDto[];
}

export interface IMrpBomByproductDto {
  bom?: any;
  bom_id?: number;
  id?: number;
  product?: any;
  product_id?: number;
  quantity?: number;
}

export interface IMrpBomLineDto {
  bom?: any;
  bom_id?: number;
  id?: number;
  product?: any;
  product_id?: number;
  quantity?: number;
}

export interface IMrpProductionDto {
  id?: number;
  name?: string;
  product_id?: number;
  product?: any;
  product_qty?: number;
  bom_id?: number;
  bom?: IMrpBomDto;
  warehouse_id?: number;
  warehouse?: any;
  state?: 'draft' | 'confirmed' | 'progress' | 'to_close' | 'done' | 'cancel' | string;
  date_planned?: string;
  date_start?: string;
  date_finished?: string;
  notes?: string;
  company_id?: number;
  created_at?: string;
}

export interface IMrpWorkcenterDto {
  capacity?: number;
  code?: string;
  costs_hour?: number;
  id?: number;
  name?: string;
  time_efficiency?: number;
  oeeSummary?: any;
}

export interface IMrpWorkorderDto {
  created_at?: string;
  duration?: number;
  id?: number;
  name?: string;
  production?: any;
  production_id?: number;
  state?: string;
  workcenter?: any;
  workcenter_id?: number;
}

export interface ICreateMORequest {
  product_id: number;
  bom_id?: number;
  product_qty: number;
  warehouse_id?: number;
  date_planned?: string;
  notes?: string;
}

export interface ICreateBomLineInput {
  product_id: number;
  quantity: number;
}

export interface ICreateBomRequest {
  product_id: number;
  code?: string;
  type?: string;
  quantity: number;
  lines: ICreateBomLineInput[];
}

