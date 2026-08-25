export interface IAppointmentDto {
  created_at?: string;
  date?: string;
  employee?: IEmployeeDto;
  employee_id?: number;
  id?: number;
  name?: string;
  notes?: string;
  partner?: IPartnerDto;
  partner_id?: number;
  state?: string;
}
