export interface ICountryDto {
  code?: string;
  id?: number;
  name?: string;
}

export interface ICountryStateDto {
  code?: string;
  country?: any;
  country_id?: number;
  id?: number;
  name?: string;
}

export interface ICurrencyDto {
  created_at?: string;
  id?: number;
  name?: string;
  symbol?: string;
}

export interface IDummy1Dto {
  city?: string;
  country?: any;
  country_id?: number;
  created_at?: string;
  email?: string;
  id?: number;
  is_company?: boolean;
  is_customer?: boolean;
  is_vendor?: boolean;
  mobile?: string;
  name?: string;
  parent?: any;
  parent_id?: number;
  phone?: string;
  state?: any;
  state_id?: number;
  street?: string;
  street2?: string;
  type?: string;
  vat?: string;
  zip?: string;
}
