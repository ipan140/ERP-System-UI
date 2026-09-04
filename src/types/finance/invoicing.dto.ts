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
}

export interface IInvoiceDto {
  id: number;
  name: string;
  partner_id: number;
  partner?: any;
  invoice_date: string;
  due_date: string;
  state: string;
  follow_up_level: number;
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  residual_amount?: number;
  payment_term_id?: number;
  payment_term?: IPaymentTermDto;
  incoterm_id?: number;
  created_at?: string;
}
