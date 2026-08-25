export interface IDeliveryMethodDto {
  fixed_cost?: number;
  id?: number;
  name?: string;
}

export interface IPricelistDto {
  created_at?: string;
  currency?: string;
  id?: number;
  name?: string;
}

export interface IPricelistItemDto {
  fixed_price?: number;
  id?: number;
  min_quantity?: number;
  pricelist?: any;
  pricelist_id?: number;
  product?: any;
  product_id?: number;
}

export interface IQuotationTemplateDto {
  id?: number;
  name?: string;
}

export interface IDummy4Dto {
  amount_tax?: number;
  amount_total?: number;
  amount_untaxed?: number;
  created_at?: string;
  date_order?: string;
  deliveryMethod?: any;
  delivery_method_id?: number;
  id?: number;
  invoicing_policy?: string;
  is_payment_link_sent?: boolean;
  is_signed?: boolean;
  name?: string;
  partner?: any;
  partner_id?: number;
  pricelist?: any;
  pricelist_id?: number;
  quotationTemplate?: any;
  quotation_template_id?: number;
  state?: string;
}

export interface ISaleOrderLineDto {
  delivered_qty?: number;
  description?: string;
  discount?: number;
  id?: number;
  invoiced_qty?: number;
  is_optional?: boolean;
  order?: any;
  order_id?: number;
  product?: any;
  product_id?: number;
  quantity?: number;
  sub_total?: number;
  unit_price?: number;
}
