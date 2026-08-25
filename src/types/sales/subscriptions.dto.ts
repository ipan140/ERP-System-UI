export interface ISubscriptionDto {
  created_at?: string;
  id?: number;
  name?: string;
  next_invoice_date?: string;
  partner?: any;
  partner_id?: number;
  plan?: any;
  plan_id?: number;
  recurring_total?: number;
  start_date?: string;
  state?: string;
}

export interface ISubscriptionPlanDto {
  billing_period?: string;
  id?: number;
  name?: string;
}
