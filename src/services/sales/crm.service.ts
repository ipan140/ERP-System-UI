import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const crmService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/sales/crm");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/sales/crm/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/sales/crm", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/sales/crm/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/sales/crm/${id}`);
  },

  // Stages (Pipeline Deals)
  async getStages(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/sales/crm/stage");
    return response.data.data ?? response.data;
  },

  async createStage(payload: { name: string; sequence?: number }): Promise<any> {
    const response = await http.post<IResponse<any>>("/sales/crm/stage", payload);
    return response.data.data ?? response.data;
  },

  async updateStage(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/sales/crm/stage/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async deleteStage(id: number | string): Promise<void> {
    await http.delete(`/sales/crm/stage/${id}`);
  },

  // Partners / Customers for lead attribution
  async getPartners(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/base/partner");
    return response.data.data ?? response.data;
  },

  async createPartner(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/base/partner", payload);
    return response.data.data ?? response.data;
  },
};
