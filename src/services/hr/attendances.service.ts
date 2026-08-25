import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const attendancesService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/hr/attendances");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/hr/attendances/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/hr/attendances", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/hr/attendances/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/hr/attendances/${id}`);
  },
};
