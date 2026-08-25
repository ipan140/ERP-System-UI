export interface IInvoiceDto {
  amount_tax?: number;
  amount_total?: number;
  amount_untaxed?: number;
  created_at?: string;
  due_date?: string;
  follow_up_level?: number;
  id?: number;
  incoterm_id?: number;
  invoice_date?: string;
  name?: string;
  partner?: any;
  partner_id?: number;
  payment_term?: IPaymentTermDto;
  payment_term_id?: number;
  residual_amount?: number;
  state?: string;
}

export interface IPaymentTermDto {
  days?: number;
  id?: number;
  name?: string;
}

export interface IPaymentTermLineDto {
  days?: number;
  id?: number;
  payment_term?: IPaymentTermDto;
  payment_term_id?: number;
  value_amount?: number;
  value_type?: string;
}

export interface ITaxDto {
  id?: number;
  name?: string;
  rate?: number;
}

export interface ITaxRepartitionLineDto {
  account_id?: number;
  factor_percent?: number;
  id?: number;
  repartition_type?: string;
  tax?: ITaxDto;
  tax_id?: number;
}
