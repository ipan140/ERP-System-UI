import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const fieldServiceService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/services/field_service");
    return response.data.data ?? response.data;
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
};
