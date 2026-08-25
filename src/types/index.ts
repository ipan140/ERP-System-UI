export interface IResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface IRoleDto {
  id?: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ICountryDto {
  id?: number;
  name: string;
  code?: string;
}
