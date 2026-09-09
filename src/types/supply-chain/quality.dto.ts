export interface IQualitySummary {
  total_checks_count: number;
  pending_checks_count: number;
  passed_checks_count: number;
  failed_checks_count: number;
  total_points_count: number;
}

export interface IQualityPointDto {
  id?: number;
  name: string;
  product_id: number;
  product?: any;
  test_type?: 'passfail' | 'measure' | string;
  norm?: number;
  tolerance?: number;
  created_at?: string;
}

export interface IQualityCheckDto {
  id?: number;
  name?: string;
  point_id?: number;
  point?: IQualityPointDto;
  product_id: number;
  product?: any;
  picking_id?: number;
  picking?: any;
  production_id?: number;
  production?: any;
  result?: 'pending' | 'pass' | 'fail' | string;
  measure_value?: number;
  notes?: string;
  inspector_id?: number;
  inspector?: any;
  inspected_at?: string;
  created_at?: string;
}

export interface ICreateQualityCheckPayload {
  point_id?: number;
  product_id: number;
  picking_id?: number;
  production_id?: number;
  measure_value?: number;
  notes?: string;
}

export interface IProcessQualityCheckPayload {
  result: 'pass' | 'fail';
  measure_value?: number;
  notes?: string;
}

export interface ICreateQualityPointPayload {
  name: string;
  product_id: number;
  test_type: 'passfail' | 'measure' | string;
  norm?: number;
  tolerance?: number;
}

