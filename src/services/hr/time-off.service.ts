import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const timeOffService = {
  async getAll(params?: any): Promise<any> {
    const response = await http.get<IResponse<any[]>>("/hr/time_off", { params });
    return response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/hr/time_off/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/hr/time_off", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/hr/time_off/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/hr/time_off/${id}`);
  },
};
