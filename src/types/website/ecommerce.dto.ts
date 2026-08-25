export interface ICartDto {
  id?: number;
}

export interface ICartItemDto {
  cart?: any;
  cart_id?: number;
  id?: number;
  product?: any;
  product_id?: number;
  quantity?: number;
}

export interface IPortalUserDto {
  customer?: any;
  customer_id?: number;
  id?: number;
  last_login?: string;
  password?: string;
}

export interface IShoppingCartDto {
  customer?: any;
  customer_id?: number;
  id?: number;
  is_abandoned?: boolean;
  recovery_sent?: boolean;
  session_id?: string;
  updated_at?: string;
}
