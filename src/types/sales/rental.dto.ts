export interface IRentalOrderDto {
  created_at?: string;
  id?: number;
  name?: string;
  partner?: any;
  partner_id?: number;
  pickup_date?: string;
  return_date?: string;
  state?: string;
  total?: number;
}

export interface IRentalOrderLineDto {
  id?: number;
  order?: any;
  order_id?: number;
  price_unit?: number;
  product?: any;
  product_id?: number;
  qty?: number;
  sub_total?: number;
}
