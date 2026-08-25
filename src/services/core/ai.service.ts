import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const artificialIntelligenceService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/artificial_intelligence");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/artificial_intelligence/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/artificial_intelligence", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/artificial_intelligence/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/artificial_intelligence/${id}`);
  },
};
