import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const ecommerceService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/website/ecommerce");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/website/ecommerce/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/website/ecommerce", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/website/ecommerce/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/website/ecommerce/${id}`);
  },
};
