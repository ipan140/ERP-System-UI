import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const surveysService = {
  async getAll(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any } | any[]> {
    const response = await http.get<any>("/marketing/surveys", { params });
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
    const response = await http.get<IResponse<any>>(`/marketing/surveys/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/surveys", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/surveys/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/marketing/surveys/${id}`);
  },

  async getPublicSurvey(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/public/surveys/${id}`);
    return response.data.data ?? response.data;
  },

  async submitPublicResponse(id: number | string, rating: number, feedback?: string): Promise<any> {
    const response = await http.post<IResponse<any>>(`/public/surveys/${id}/respond`, {
      rating,
      feedback,
    });
    return response.data.data ?? response.data;
  },
};
