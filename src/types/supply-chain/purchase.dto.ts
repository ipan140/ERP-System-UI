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
  amount_tax?: number;
  amount_total?: number;
  amount_untaxed?: number;
  created_at?: string;
  date_order?: string;
  id?: number;
  name?: string;
  partner?: any;
  partner_id?: number;
  requisition?: any;
  requisition_id?: number;
  state?: string;
}

export interface IPurchaseOrderLineDto {
  id?: number;
  name?: string;
  order?: any;
  order_id?: number;
  price_subtotal?: number;
  price_unit?: number;
  product?: any;
  product_id?: number;
  qty_invoiced?: number;
  qty_received?: number;
  quantity?: number;
  taxes?: any;
  taxes_id?: number;
}

export interface IPurchaseRequisitionDto {
  created_at?: string;
  date_end?: string;
  id?: number;
  name?: string;
  state?: string;
}
