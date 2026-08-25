export interface ICompanyDto {
  created_at?: string;
  id?: number;
  name?: string;
  updated_at?: string;
}

export interface ILoginRequestDto {
  email?: string;
  password?: string;
}

export interface IDummy0Dto {
  company?: ICompanyDto;
  company_id?: number;
  created_at?: string;
  email?: string;
  id?: number;
  name?: string;
  role?: string;
  updated_at?: string;
}
