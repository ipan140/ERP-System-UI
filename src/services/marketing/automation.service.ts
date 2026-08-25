import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const marketingAutomationService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/marketing/marketing_automation");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/marketing/marketing_automation/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/marketing_automation", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/marketing_automation/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/marketing/marketing_automation/${id}`);
  },
};
