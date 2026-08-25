export interface IActivityDto {
  created_at?: string;
  deadline?: string;
  id?: number;
  is_done?: boolean;
  lead?: any;
  lead_id?: number;
  summary?: string;
  type?: string;
}

export interface ILeadDto {
  created_at?: string;
  email?: string;
  expected_revenue?: number;
  id?: number;
  name?: string;
  partner?: any;
  partner_id?: number;
  phone?: string;
  probability?: number;
  salesTeam?: any;
  sales_team_id?: number;
  salesperson?: any;
  salesperson_id?: number;
  stage?: any;
  stage_id?: number;
}

export interface ISalesCommissionDto {
  amount?: number;
  created_at?: string;
  date?: string;
  id?: number;
  salesperson?: any;
  salesperson_id?: number;
  state?: string;
}

export interface ISalesTeamDto {
  created_at?: string;
  id?: number;
  invoicing_target?: number;
  manager?: any;
  manager_id?: number;
  name?: string;
}

export interface IStageDto {
  id?: number;
  name?: string;
  sequence?: number;
}
