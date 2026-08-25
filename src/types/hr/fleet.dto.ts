export interface IVehicleDto {
  created_at?: string;
  employee?: any;
  employee_id?: number;
  id?: number;
  license_plate?: string;
  model_name?: string;
  state?: string;
}

export interface IVehicleLogContractDto {
  cost?: number;
  expiration?: string;
  id?: number;
  vehicle?: any;
  vehicle_id?: number;
}

export interface IVehicleLogFuelDto {
  amount?: number;
  date?: string;
  id?: number;
  liters?: number;
  vehicle?: any;
  vehicle_id?: number;
}

export interface IVehicleLogServicesDto {
  amount?: number;
  date?: string;
  description?: string;
  id?: number;
  vehicle?: any;
  vehicle_id?: number;
}
