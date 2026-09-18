import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const storageService = {
  async getAll(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any } | any[]> {
    const response = await http.get<any>("/core/storage", { params });
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
    const response = await http.get<IResponse<any>>(`/core/storage/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/core/storage", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/core/storage/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/core/storage/${id}`);
  },

  async getConfig(): Promise<any> {
    const response = await http.get<IResponse<any>>("/core/storage/config");
    return response.data.data ?? response.data;
  },

  async saveConfig(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/core/storage/config", payload);
    return response.data.data ?? response.data;
  },

  async getStats(): Promise<any> {
    const response = await http.get<IResponse<any>>("/core/storage/stats");
    return response.data.data ?? response.data;
  },

  async cleanTemp(): Promise<any> {
    const response = await http.post<IResponse<any>>("/core/storage/clean-temp");
    return response.data.data ?? response.data;
  },
};
