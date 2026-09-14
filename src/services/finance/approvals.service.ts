import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const approvalsService = {
  async getAll(params?: Record<string, any>): Promise<any> {
    const response = await http.get<IResponse<any>>("/finance/approvals", { params });
    return response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/finance/approvals/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/finance/approvals", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/finance/approvals/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/finance/approvals/${id}`);
  },
};
