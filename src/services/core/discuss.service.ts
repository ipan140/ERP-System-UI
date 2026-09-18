import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const discussService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/discuss");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/discuss/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/discuss", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/discuss/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/discuss/${id}`);
  },

  async getChannels(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/discuss/channels");
    return response.data.data ?? response.data;
  },

  async getMessages(channelId: string): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/discuss/messages", {
      params: { channel_id: channelId }
    });
    return response.data.data ?? response.data;
  },

  async sendMessage(channelId: string, text: string, sender?: string): Promise<any> {
    const response = await http.post<IResponse<any>>("/discuss/messages", {
      channel_id: channelId,
      text,
      sender
    });
    return response.data.data ?? response.data;
  }
};
