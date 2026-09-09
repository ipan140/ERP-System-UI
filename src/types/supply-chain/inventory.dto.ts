export interface IProductDto {
  id?: number;
  product_template_id?: number;
  ProductTemplate?: IProductTemplateDto;
  productTemplate?: IProductTemplateDto;
  default_code?: string;
  barcode?: string;
  volume?: number;
  weight?: number;
  stock_qty?: number;
  reserved_qty?: number;
  created_at?: string;
}

export interface IInventorySummaryDto {
  total_sku: number;
  total_valuation: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_reserved: number;
  total_on_hand: number;
}

export interface IStockAdjustmentPayload {
  product_id: number;
  location_id?: number;
  theoretical_qty: number;
  counted_qty: number;
  reason: string;
}

export interface IInternalTransferPayload {
  product_id: number;
  source_warehouse_id?: number;
  dest_warehouse_id: number;
  quantity: number;
  notes?: string;
}

export interface IInventoryFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  warehouse_id?: number;
  stock_status?: string;
  all?: string;
}

export type IDummy5Dto = IProductDto;

export interface IProductAttributeDto {
  id?: number;
  name?: string;
}

export interface IProductAttributeValueDto {
  attribute?: any;
  attribute_id?: number;
  id?: number;
  name?: string;
}

export interface IProductCategoryDto {
  costing_method?: string;
  id?: number;
  name?: string;
  parent?: any;
  parent_id?: number;
}

export interface IProductTemplateDto {
  category?: any;
  category_id?: number;
  created_at?: string;
  id?: number;
  list_price?: number;
  name?: string;
  standard_price?: number;
  tracking?: string;
  type?: string;
  uoM?: any;
  uom_id?: number;
  uom_po_id?: number;
  uompo?: any;
}

export interface IStockLocationDto {
  barcode?: string;
  id?: number;
  name?: string;
  parent?: any;
  parent_id?: number;
  usage?: string;
  warehouse?: any;
  warehouse_id?: number;
}

export interface IStockLotDto {
  company?: any;
  company_id?: number;
  created_at?: string;
  expiration_date?: string;
  id?: number;
  name?: string;
  product?: any;
  product_id?: number;
}

export interface IStockPickingDto {
  created_at?: string;
  id?: number;
  location?: any;
  location_dest_id?: number;
  location_id?: number;
  locationdest?: any;
  name?: string;
  partner?: any;
  partner_id?: number;
  scheduled_date?: string;
  state?: string;
}

export interface IStockPutawayRuleDto {
  category?: any;
  category_id?: number;
  id?: number;
  location_in_id?: number;
  location_out_id?: number;
  locationin?: any;
  locationout?: any;
  product?: any;
  product_id?: number;
}

export interface IStockQuantDto {
  id?: number;
  location?: any;
  location_id?: number;
  lot?: any;
  lot_id?: number;
  product?: any;
  product_id?: number;
  quantity?: number;
}

export interface IStockValuationLayerDto {
  created_at?: string;
  description?: string;
  id?: number;
  product?: any;
  product_id?: number;
  quantity?: number;
  unit_cost?: number;
  value?: number;
}

export interface IStockWarehouseDto {
  code?: string;
  company?: any;
  company_id?: number;
  created_at?: string;
  id?: number;
  name?: string;
}

export interface IUoMDto {
  category?: any;
  category_id?: number;
  factor?: number;
  id?: number;
  name?: string;
  type?: string;
}

export interface IUoMCategoryDto {
  id?: number;
  name?: string;
}
