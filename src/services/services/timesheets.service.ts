import { http } from "@/services/http";
import type { IPaginatedResponse, IResponse } from "@/types";

export const timesheetsService = {
  async getAll(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any }> {
    const response = await http.get<IPaginatedResponse<any[]>>("/services/timesheets", { params });
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
    const response = await http.get<IResponse<any>>(`/services/timesheets/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/services/timesheets", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/services/timesheets/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/services/timesheets/${id}`);
  },

  // Fase 2: Workflow Approval Methods
  async submit(id: number | string): Promise<any> {
    const response = await http.post<IResponse<any>>(`/services/timesheets/${id}/submit`);
    return response.data.data ?? response.data;
  },

  async approve(id: number | string): Promise<any> {
    const response = await http.post<IResponse<any>>(`/services/timesheets/${id}/approve`);
    return response.data.data ?? response.data;
  },

  async reject(id: number | string, reason?: string): Promise<any> {
    const response = await http.post<IResponse<any>>(`/services/timesheets/${id}/reject`, { reason });
    return response.data.data ?? response.data;
  },

  async bulkApprove(ids: (number | string)[]): Promise<any> {
    const response = await http.post<IResponse<any>>("/services/timesheets/bulk-approve", { ids });
    return response.data.data ?? response.data;
  },
};
