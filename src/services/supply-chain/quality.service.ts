import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const qualityService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/supply_chain/quality");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/supply_chain/quality/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/supply_chain/quality", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/supply_chain/quality/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/quality/${id}`);
  },
};
