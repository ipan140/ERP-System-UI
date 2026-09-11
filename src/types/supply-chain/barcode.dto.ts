export interface IBarcodeRuleDto {
  id: number;
  name: string;
  nomenclature_id: number;
  sequence: number;
  type: string; // product, lot, location, package, weight
  encoding: string; // any, ean13, ean8, upca, gs1-128
  pattern: string;
  created_at?: string;
}

export interface IBarcodeNomenclatureDto {
  id: number;
  name: string;
  upc_ean_conv: string;
  rules?: IBarcodeRuleDto[];
  created_at?: string;
}

export interface IBarcodeScanRequest {
  barcode: string;
}

export interface IBarcodeScanResponse {
  type: 'product' | 'location' | 'picking' | 'mo' | 'qc' | string;
  found: boolean;
  barcode: string;
  title: string;
  data: any;
}

export interface IBarcodeSummaryDto {
  total_nomenclatures: number;
  total_rules: number;
  total_barcoded_skus: number;
}
