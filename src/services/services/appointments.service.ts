import { http } from "@/services/http";
import type { IPaginatedResponse, IResponse } from "@/types";

export const appointmentsService = {
  async getAll(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any }> {
    const response = await http.get<IPaginatedResponse<any[]>>("/services/appointments", { params });
    const resData = response.data as any;
    if (Array.isArray(resData)) {
      return { data: resData };
    }
    return {
      data: resData.data || [],
      pagination: resData.pagination
    };
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/services/appointments/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/services/appointments", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/services/appointments/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/services/appointments/${id}`);
  },
};
