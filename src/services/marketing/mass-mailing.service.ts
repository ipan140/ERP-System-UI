import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const massMailingService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/marketing/mass_mailing");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/marketing/mass_mailing/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/mass_mailing", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/mass_mailing/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/marketing/mass_mailing/${id}`);
  },

  async requestApproval(id: number | string): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/mass_mailing/${id}/request-approval`);
    return response.data.data ?? response.data;
  },

  async approve(id: number | string): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/mass_mailing/${id}/approve`);
    return response.data.data ?? response.data;
  },

  async reject(id: number | string, reason: string): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/mass_mailing/${id}/reject`, { reason });
    return response.data.data ?? response.data;
  },

  async getAllUtm(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/marketing/mass_mailing/utmtracker");
    return response.data.data ?? response.data;
  },

  async createUtm(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/mass_mailing/utmtracker", payload);
    return response.data.data ?? response.data;
  },

  async updateUtm(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/mass_mailing/utmtracker/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async deleteUtm(id: number | string): Promise<void> {
    await http.delete(`/marketing/mass_mailing/utmtracker/${id}`);
  },

  async runABTest(id: number | string): Promise<any> {
    const response = await http.post<IResponse<any>>(`/marketing/mass_mailing/${id}/ab-test`);
    return response.data.data ?? response.data;
  },
};
