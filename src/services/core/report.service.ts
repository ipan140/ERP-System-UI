import { http } from "@/services/http";
import type { IResponse } from "@/types";

export const reportService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/core/report");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/core/report/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/core/report", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/core/report/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/core/report/${id}`);
  },

  async getTemplates(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/core/report/templates");
    return response.data.data ?? response.data;
  },

  async createTemplate(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/core/report/templates", payload);
    return response.data.data ?? response.data;
  },

  async getExports(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/core/report/exports");
    return response.data.data ?? response.data;
  },

  async exportExcel(payload: any): Promise<Blob> {
    const response = await http.post("/core/report/excel", payload, { responseType: "blob" });
    return response.data;
  },

  async exportPDF(payload: any): Promise<Blob> {
    const response = await http.post("/core/report/pdf", payload, { responseType: "blob" });
    return response.data;
  }
};
