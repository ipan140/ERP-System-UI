export interface IPayslipDto {
  contract?: any;
  contract_id?: number;
  created_at?: string;
  date_from?: string;
  date_to?: string;
  employee?: any;
  employee_id?: number;
  id?: number;
  name?: string;
  state?: string;
}

export interface IPayslipLineDto {
  amount?: number;
  id?: number;
  payslip?: any;
  payslip_id?: number;
  salaryRule?: any;
  salary_rule_id?: number;
}

export interface ISalaryRuleDto {
  code?: string;
  id?: number;
  name?: string;
}
