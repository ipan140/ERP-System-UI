import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const whatsappService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/whatsapp");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/whatsapp/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/whatsapp", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/whatsapp/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/whatsapp/${id}`);
  },
};
