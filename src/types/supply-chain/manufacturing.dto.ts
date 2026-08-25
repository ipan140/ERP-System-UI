export interface IMrpBomDto {
  code?: string;
  id?: number;
  product?: any;
  product_id?: number;
  quantity?: number;
  type?: string;
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
  bom?: any;
  bom_id?: number;
  created_at?: string;
  date_planned?: string;
  id?: number;
  name?: string;
  product?: any;
  product_id?: number;
  product_qty?: number;
  state?: string;
}

export interface IMrpWorkcenterDto {
  capacity?: number;
  code?: string;
  costs_hour?: number;
  id?: number;
  name?: string;
  time_efficiency?: number;
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
