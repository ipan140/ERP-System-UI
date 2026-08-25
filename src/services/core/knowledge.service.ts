import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const knowledgeService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/knowledge");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/knowledge/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/knowledge", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/knowledge/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/knowledge/${id}`);
  },
};
