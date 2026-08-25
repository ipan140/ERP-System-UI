export interface IQualityCheckDto {
  created_at?: string;
  id?: number;
  measure_value?: number;
  name?: string;
  picking?: any;
  picking_id?: number;
  point?: any;
  point_id?: number;
  product?: any;
  product_id?: number;
  production?: any;
  production_id?: number;
  result?: string;
}

export interface IQualityPointDto {
  created_at?: string;
  id?: number;
  name?: string;
  product?: any;
  product_id?: number;
  test_type?: string;
  tolerance?: number;
}
