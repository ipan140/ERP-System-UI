import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const blogService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/website/blog");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/website/blog/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/website/blog", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/website/blog/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/website/blog/${id}`);
  },
};
