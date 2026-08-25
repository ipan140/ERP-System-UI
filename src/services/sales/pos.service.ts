import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const pointOfSaleService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/sales/point_of_sale");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/sales/point_of_sale/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/sales/point_of_sale", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/sales/point_of_sale/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/sales/point_of_sale/${id}`);
  },
};
