import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const eventsService = {
  async getAll(params?: Record<string, any>): Promise<{ data: any[]; pagination?: any } | any[]> {
    const response = await http.get<any>("/marketing/events", { params });
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
    const response = await http.get<IResponse<any>>(`/marketing/events/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/events", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/events/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/marketing/events/${id}`);
  },

  async getAllTickets(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/marketing/events/eventticket");
    return response.data.data ?? response.data;
  },

  async createTicket(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/events/eventticket", payload);
    return response.data.data ?? response.data;
  },

  async updateTicket(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/marketing/events/eventticket/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async deleteTicket(id: number | string): Promise<void> {
    await http.delete(`/marketing/events/eventticket/${id}`);
  },

  async scanTicket(barcode: string): Promise<any> {
    const response = await http.post<IResponse<any>>("/marketing/events/eventticket/scan", { barcode });
    return response.data.data ?? response.data;
  },

  async getPartners(): Promise<any[]> {
    try {
      const response = await http.get<IResponse<any[]>>("/base/partner");
      return response.data.data ?? response.data ?? [];
    } catch {
      return [];
    }
  },
};
