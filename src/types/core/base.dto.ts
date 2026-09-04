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

export interface IPartnerDto {
  id: number;
  name: string;
  is_company: boolean;
  type: string;
  email: string;
  phone: string;
  city: string;
  vat: string;
  is_customer: boolean;
  is_vendor: boolean;
  created_at: string;
  country?: any;
  country_id?: number;
  mobile?: string;
  parent?: any;
  parent_id?: number;
  state?: any;
  state_id?: number;
  street?: string;
  street2?: string;
  zip?: string;
}

export interface IDummy1Dto extends IPartnerDto {}
