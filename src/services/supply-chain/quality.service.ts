import { http } from "@/services/http";
import type { IResponse, IPaginatedResponse } from "@/types";
import type {
  IQualitySummary,
  IQualityCheckDto,
  IQualityPointDto,
  ICreateQualityCheckPayload,
  IProcessQualityCheckPayload,
  ICreateQualityPointPayload,
} from "@/types/supply-chain/quality.dto";

export const qualityService = {
  async getSummary(): Promise<IQualitySummary> {
    const response = await http.get<IResponse<IQualitySummary>>("/supply_chain/quality/summary");
    return response.data.data;
  },

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    product_id?: number;
  }): Promise<{ data: IQualityCheckDto[]; pagination: any }> {
    const response = await http.get<IPaginatedResponse<IQualityCheckDto[]>>("/supply_chain/quality", {
      params,
    });
    return {
      data: response.data.data || [],
      pagination: response.data.pagination,
    };
  },

  async getById(id: number | string): Promise<IQualityCheckDto> {
    const response = await http.get<IResponse<IQualityCheckDto>>(`/supply_chain/quality/${id}`);
    return response.data.data;
  },

  async create(payload: ICreateQualityCheckPayload): Promise<IQualityCheckDto> {
    const response = await http.post<IResponse<IQualityCheckDto>>("/supply_chain/quality", payload);
    return response.data.data;
  },

  async processCheck(id: number | string, payload: IProcessQualityCheckPayload): Promise<IQualityCheckDto> {
    const response = await http.put<IResponse<IQualityCheckDto>>(`/supply_chain/quality/${id}/process`, payload);
    return response.data.data;
  },

  async getPoints(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ data: IQualityPointDto[]; pagination: any }> {
    const response = await http.get<IPaginatedResponse<IQualityPointDto[]>>("/supply_chain/quality/point", {
      params,
    });
    return {
      data: response.data.data || [],
      pagination: response.data.pagination,
    };
  },

  async createPoint(payload: ICreateQualityPointPayload): Promise<IQualityPointDto> {
    const response = await http.post<IResponse<IQualityPointDto>>("/supply_chain/quality/point", payload);
    return response.data.data;
  },

  async deletePoint(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/quality/point/${id}`);
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/quality/${id}`);
  },
};

