import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const surveysService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/marketing/surveys");
    return response.data.data ?? response.data;
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
