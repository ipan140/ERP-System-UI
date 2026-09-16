import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const marketingAutomationService = {
  async getAll(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any } | any[]> {
    const response = await http.get<any>("/marketing/marketing_automation", { params });
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
    const response = await http.get<IResponse<any>>(`/marketing/marketing_automation/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/marketing_automation", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/marketing_automation/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/marketing/marketing_automation/${id}`);
  },

  async getAllActivities(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/marketing/marketing_automation/workflowactivity");
    return response.data.data ?? response.data;
  },

  async createActivity(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/marketing_automation/workflowactivity", payload);
    return response.data.data ?? response.data;
  },

  async updateActivity(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/marketing_automation/workflowactivity/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async deleteActivity(id: number | string): Promise<void> {
    await http.delete(`/marketing/marketing_automation/workflowactivity/${id}`);
  },

  async getJourneyLogs(campaignId: number | string): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>(`/marketing/marketing_automation/${campaignId}/journey-logs`);
    return response.data.data ?? response.data;
  },

  async simulateJourney(campaignId: number | string): Promise<any[]> {
    const response = await http.post<IResponse<any[]>>(`/marketing/marketing_automation/${campaignId}/simulate-journey`);
    return response.data.data ?? response.data;
  },
};
