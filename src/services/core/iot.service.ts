import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const iotService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/iot");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/iot/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/iot", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/iot/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/iot/${id}`);
  },

  async getDevices(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/iot/devices");
    return response.data.data ?? response.data;
  },

  async getAttendanceLogs(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/iot/attendance-logs");
    return response.data.data ?? response.data;
  },

  async pingDevice(id: number | string): Promise<any> {
    const response = await http.post<IResponse<any>>(`/iot/ping/${id}`);
    return response.data.data ?? response.data;
  },

  async syncPresensi(): Promise<any> {
    const response = await http.post<IResponse<any>>("/iot/sync-presensi");
    return response.data.data ?? response.data;
  }
};
