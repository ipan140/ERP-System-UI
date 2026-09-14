import { http } from "@/services/http";
import type { IResponse, IPaginatedResponse } from "@/types";

export const rentalService = {
  async getAll(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any } | any[]> {
    const response = await http.get<any>("/sales/rental", { params });
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
    const response = await http.get<IResponse<any>>(`/sales/rental/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/sales/rental", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/sales/rental/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/sales/rental/${id}`);
  },
};
