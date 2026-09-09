import { http } from "@/services/http";
import type { IPaginatedResponse, IResponse } from "@/types";

export const fieldServiceService = {
  async getAll(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any }> {
    const response = await http.get<IPaginatedResponse<any[]>>("/services/field_service", { params });
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
    const response = await http.get<IResponse<any>>(`/services/field_service/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/services/field_service", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/services/field_service/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/services/field_service/${id}`);
  },

  // Fase 2: e-BAST Validation Gate Method
  async validateBast(id: number | string): Promise<any> {
    const response = await http.post<IResponse<any>>(`/services/field_service/${id}/validate-bast`);
    return response.data.data ?? response.data;
  },

  // Fase 4: GPS Geotagging
  async checkIn(id: number | string, lat: number, lng: number): Promise<any> {
    const response = await http.post<IResponse<any>>(`/services/field_service/${id}/check-in`, { lat, lng });
    return response.data.data ?? response.data;
  },

  async checkOut(id: number | string, lat: number, lng: number): Promise<any> {
    const response = await http.post<IResponse<any>>(`/services/field_service/${id}/check-out`, { lat, lng });
    return response.data.data ?? response.data;
  },
};
