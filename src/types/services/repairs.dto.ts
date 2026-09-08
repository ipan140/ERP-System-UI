export interface IRepairOrderDto {
  id?: number;
  name?: string;
  product_id?: number;
  product?: any;
  partner_id?: number;
  partner?: any;
  serial_number?: string;
  warranty_status?: 'under_warranty' | 'expired' | 'no_warranty' | string;
  diagnosis?: string;
  parts_cost?: number;
  labor_cost?: number;
  total_cost?: number;
  state?: string;
  technician_id?: number;
  created_at?: string;
}

