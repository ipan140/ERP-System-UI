export interface IScmAlertItem {
  type: string; // stock, purchase, manufacturing, maintenance, quality
  severity: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  ref_code: string;
}

export interface IScmDashboardSummary {
  total_inventory_valuation: number;
  total_sku_count: number;
  low_stock_count: number;
  total_active_pos: number;
  monthly_purchase_spend: number;
  active_manufacturing_mos: number;
  completed_mos_monthly: number;
  quality_pass_rate: number;
  total_qc_checks: number;
  total_equipments: number;
  active_maintenance_tickets: number;
  alerts: IScmAlertItem[];
}

export interface IScmCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'purchase' | 'manufacturing' | 'maintenance' | string;
  status: string;
  color: string;
  description: string;
}
