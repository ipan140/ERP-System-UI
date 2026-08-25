export interface IPlmEcoDto {
  created_at?: string;
  id?: number;
  name?: string;
  new_bom_id?: number;
  newbom?: any;
  old_bom_id?: number;
  oldbom?: any;
  product?: any;
  product_id?: number;
  state?: string;
  type?: any;
  type_id?: number;
}

export interface IPlmEcoTypeDto {
  id?: number;
  name?: string;
}
