export interface IProductSupplierInfoDto {
  delay?: number;
  id?: number;
  min_qty?: number;
  partner?: any;
  partner_id?: number;
  price?: number;
  product?: any;
  product_id?: number;
}

export interface IPurchaseOrderDto {
  id?: number;
  name?: string;
  partner_id?: number;
  partner?: any;
  requisition_id?: number;
  requisition?: any;
  state?: 'draft' | 'sent' | 'to_approve' | 'purchase' | 'done' | 'cancel' | string;
  amount_untaxed?: number;
  amount_tax?: number;
  amount_total?: number;
  date_order?: string;
  notes?: string;
  company_id?: number;
  approved_by?: number;
  approved_at?: string;
  created_at?: string;
  order_lines?: IPurchaseOrderLineDto[];
}

export interface IPurchaseOrderLineDto {
  id?: number;
  order_id?: number;
  order?: any;
  product_id?: number;
  product?: any;
  name?: string;
  quantity?: number;
  qty_received?: number;
  qty_invoiced?: number;
  price_unit?: number;
  taxes_id?: number;
  taxes?: any;
  price_subtotal?: number;
}

export interface IPurchaseSummaryDto {
  total_spent_monthly: number;
  to_approve_count: number;
  to_receive_count: number;
  active_vendor_count: number;
  total_po_count: number;
}

export interface ICreatePOLinePayload {
  product_id: number;
  name?: string;
  quantity: number;
  price_unit: number;
}

export interface ICreatePOPayload {
  partner_id: number;
  date_order?: string;
  notes?: string;
  lines: ICreatePOLinePayload[];
}

export interface IReceiveGoodsItemPayload {
  line_id: number;
  qty_received: number;
}

export interface IReceiveGoodsPayload {
  warehouse_id?: number;
  items: IReceiveGoodsItemPayload[];
  notes?: string;
}

export interface IPurchaseRequisitionDto {
  created_at?: string;
  date_end?: string;
  id?: number;
  name?: string;
  state?: string;
}
