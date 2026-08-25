import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const mailerService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/core/mailer");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/core/mailer/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/core/mailer", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/core/mailer/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/core/mailer/${id}`);
  },
};
