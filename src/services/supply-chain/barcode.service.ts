import { http } from "@/services/http";
import type { IResponse } from "@/types";
import type {
  IBarcodeNomenclatureDto,
  IBarcodeScanResponse,
  IBarcodeSummaryDto,
} from "@/types/supply-chain/barcode.dto";

export const barcodeService = {
  async scan(barcode: string): Promise<IBarcodeScanResponse> {
    const response = await http.post<IResponse<IBarcodeScanResponse>>("/supply_chain/barcode/scan", { barcode });
    return response.data.data;
  },

  async getSummary(): Promise<IBarcodeSummaryDto> {
    const response = await http.get<IResponse<IBarcodeSummaryDto>>("/supply_chain/barcode/summary");
    return response.data.data;
  },

  async getAll(): Promise<IBarcodeNomenclatureDto[]> {
    const response = await http.get<IResponse<IBarcodeNomenclatureDto[]>>("/supply_chain/barcode");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<IBarcodeNomenclatureDto> {
    const response = await http.get<IResponse<IBarcodeNomenclatureDto>>(`/supply_chain/barcode/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: Partial<IBarcodeNomenclatureDto>): Promise<IBarcodeNomenclatureDto> {
    const response = await http.post<IResponse<IBarcodeNomenclatureDto>>("/supply_chain/barcode", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: Partial<IBarcodeNomenclatureDto>): Promise<IBarcodeNomenclatureDto> {
    const response = await http.put<IResponse<IBarcodeNomenclatureDto>>(`/supply_chain/barcode/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/barcode/${id}`);
  },
};
