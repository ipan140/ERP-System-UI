import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const payrollService = {
  async getAll(params?: any): Promise<any> {
    const response = await http.get<IResponse<any[]>>("/hr/payroll", { params });
    return response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/hr/payroll/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/hr/payroll", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/hr/payroll/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/hr/payroll/${id}`);
  },
};
