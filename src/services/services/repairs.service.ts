import { http } from "@/services/http";
import type { IPaginatedResponse, IResponse } from "@/types";

export const repairsService = {
  async getAll(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any }> {
    const response = await http.get<IPaginatedResponse<any[]>>("/services/repairs", { params });
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
    const response = await http.get<IResponse<any>>(`/services/repairs/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/services/repairs", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/services/repairs/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/services/repairs/${id}`);
  },

  // Fase 2: Quality Control Gate Method
  async passQC(id: number | string, notes?: string): Promise<any> {
    const response = await http.post<IResponse<any>>(`/services/repairs/${id}/qc-pass`, { notes });
    return response.data.data ?? response.data;
  },

  // Fase 4: Public Tracking & Customer Approval
  async trackPublic(rma: string, sn?: string): Promise<any> {
    const response = await http.get<IResponse<any>>("/public/services/tracking", {
      params: { rma, sn }
    });
    return response.data.data ?? response.data;
  },

  async approveEstimate(payload: { rma?: string; id?: number; serial_number?: string; note?: string }): Promise<any> {
    const response = await http.post<IResponse<any>>("/public/services/tracking/approve-estimate", payload);
    return response.data.data ?? response.data;
  },
};
