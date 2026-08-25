import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const plmService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/supply_chain/plm");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/supply_chain/plm/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/supply_chain/plm", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/supply_chain/plm/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/plm/${id}`);
  },
};
