import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const signService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/finance/sign");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/finance/sign/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/finance/sign", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/finance/sign/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/finance/sign/${id}`);
  },
};
