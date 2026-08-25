export interface ILoyaltyProgramDto {
  id?: number;
  name?: string;
  reward?: IProductDto;
  reward_id?: number;
  type?: string;
}

export interface IPosConfigDto {
  created_at?: string;
  has_credit?: boolean;
  id?: number;
  name?: string;
}

export interface IPosOrderDto {
  created_at?: string;
  id?: number;
  name?: string;
  partner?: IPartnerDto;
  partner_id?: number;
  session?: IPosSessionDto;
  session_id?: number;
  state?: string;
  total?: number;
}

export interface IPosOrderLineDto {
  id?: number;
  order?: ISaleOrderDto;
  order_id?: number;
  price_unit?: number;
  product?: IProductDto;
  product_id?: number;
  qty?: number;
  sub_total?: number;
}

export interface IPosPaymentDto {
  amount?: number;
  id?: number;
  method?: string;
  order?: ISaleOrderDto;
  order_id?: number;
}

export interface IPosSessionDto {
  config?: IPosConfigDto;
  config_id?: number;
  created_at?: string;
  id?: number;
  name?: string;
  state?: string;
}
