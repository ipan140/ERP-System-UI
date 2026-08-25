import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const spreadsheetBiService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/finance/spreadsheet_bi");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/finance/spreadsheet_bi/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/finance/spreadsheet_bi", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/finance/spreadsheet_bi/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/finance/spreadsheet_bi/${id}`);
  },
};
