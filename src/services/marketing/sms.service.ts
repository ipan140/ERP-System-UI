import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const smsMarketingService = {
  async getAll(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any } | any[]> {
    const response = await http.get<any>("/marketing/sms_marketing", { params });
    const resData = response.data;
    if (Array.isArray(resData)) {
      return resData;
    }
    if (resData && Array.isArray(resData.data)) {
      return {
        data: resData.data,
        pagination: resData.pagination
      };
    }
    return { data: [], pagination: undefined };
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

  async broadcast(id: number | string): Promise<any> {
    const response = await http.post<IResponse<any>>(`/marketing/sms_marketing/${id}/broadcast`);
    return response.data.data ?? response.data;
  },

  async sendTest(id: number | string, payload: { target_phone: string; channel?: string }): Promise<any> {
    const response = await http.post<IResponse<any>>(`/marketing/sms_marketing/${id}/send-test`, payload);
    return response.data.data ?? response.data;
  },

  // WhatsApp Meta Cloud API
  async getTemplates(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/marketing/sms_marketing/templates");
    return response.data.data ?? response.data;
  },

  async createTemplate(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/sms_marketing/templates", payload);
    return response.data.data ?? response.data;
  },

  async updateTemplate(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/sms_marketing/templates/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async deleteTemplate(id: number | string): Promise<void> {
    await http.delete(`/marketing/sms_marketing/templates/${id}`);
  },

  async getConfig(): Promise<any> {
    const response = await http.get<IResponse<any>>("/marketing/sms_marketing/config");
    return response.data.data ?? response.data;
  },

  async saveConfig(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/sms_marketing/config", payload);
    return response.data.data ?? response.data;
  },
};
