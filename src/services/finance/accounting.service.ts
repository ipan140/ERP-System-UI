import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const accountingService = {
  async getAll(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any } | any[]> {
    const response = await http.get<any>("/finance/accounting", { params });
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

  async getAllAccounts(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any } | any[]> {
    const response = await http.get<any>("/finance/accounting/accounts", { params });
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
    const response = await http.get<IResponse<any>>(`/finance/accounting/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/finance/accounting", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/finance/accounting/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/finance/accounting/${id}`);
  },
};
