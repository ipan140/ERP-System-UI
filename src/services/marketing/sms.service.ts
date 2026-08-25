import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const smsMarketingService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/marketing/sms_marketing");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/marketing/sms_marketing/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/sms_marketing", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/sms_marketing/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/marketing/sms_marketing/${id}`);
  },
};
