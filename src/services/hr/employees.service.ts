import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const employeesService = {
  async getAll(params?: Record<string, any>): Promise<any> {
    const response = await http.get<IResponse<any>>("/hr/employees", { params });
    return response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/hr/employees/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/hr/employees", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/hr/employees/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/hr/employees/${id}`);
  },
};
