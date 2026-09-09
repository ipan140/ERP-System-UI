import { http } from "@/services/http";
import type { IResponse, IPaginatedResponse } from "@/types";
import type {
  IMrpSummaryDto,
  IMrpProductionDto,
  ICreateMORequest,
  IMrpBomDto,
  ICreateBomRequest,
  IMrpWorkcenterDto
} from "@/types/supply-chain/manufacturing.dto";

export const manufacturingService = {
  // Executive Summary
  async getSummary(): Promise<IMrpSummaryDto> {
    const response = await http.get<IResponse<IMrpSummaryDto>>("/supply_chain/manufacturing/summary");
    return (response.data.data ?? response.data) as IMrpSummaryDto;
  },

  // Manufacturing Orders (MO)
  async getAllProductions(params?: Record<string, any>): Promise<{ data: IMrpProductionDto[]; pagination?: any }> {
    const response = await http.get<IPaginatedResponse<IMrpProductionDto[]>>("/supply_chain/manufacturing", { params });
    const resData = response.data as any;
    if (Array.isArray(resData)) {
      return { data: resData };
    }
    return {
      data: resData.data || [],
      pagination: resData.pagination
    };
  },

  async getProductionById(id: number | string): Promise<IMrpProductionDto> {
    const response = await http.get<IResponse<IMrpProductionDto>>(`/supply_chain/manufacturing/${id}`);
    return (response.data.data ?? response.data) as IMrpProductionDto;
  },

  async createProduction(payload: ICreateMORequest): Promise<IMrpProductionDto> {
    const response = await http.post<IResponse<IMrpProductionDto>>("/supply_chain/manufacturing", payload);
    return (response.data.data ?? response.data) as IMrpProductionDto;
  },

  async confirmProduction(id: number | string): Promise<IMrpProductionDto> {
    const response = await http.post<IResponse<IMrpProductionDto>>(`/supply_chain/manufacturing/${id}/confirm`);
    return (response.data.data ?? response.data) as IMrpProductionDto;
  },

  async startProduction(id: number | string): Promise<IMrpProductionDto> {
    const response = await http.post<IResponse<IMrpProductionDto>>(`/supply_chain/manufacturing/${id}/start`);
    return (response.data.data ?? response.data) as IMrpProductionDto;
  },

  async finishProduction(id: number | string): Promise<IMrpProductionDto> {
    const response = await http.post<IResponse<IMrpProductionDto>>(`/supply_chain/manufacturing/${id}/finish`);
    return (response.data.data ?? response.data) as IMrpProductionDto;
  },

  async cancelProduction(id: number | string): Promise<IMrpProductionDto> {
    const response = await http.post<IResponse<IMrpProductionDto>>(`/supply_chain/manufacturing/${id}/cancel`);
    return (response.data.data ?? response.data) as IMrpProductionDto;
  },

  async deleteProduction(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/manufacturing/${id}`);
  },

  // Bill of Materials (BOM)
  async getAllBoms(params?: Record<string, any>): Promise<{ data: IMrpBomDto[]; pagination?: any }> {
    const response = await http.get<any>("/supply_chain/manufacturing/mrpbom", { params });
    const resData = response.data as any;
    if (Array.isArray(resData)) {
      return { data: resData };
    }
    return {
      data: resData.data || [],
      pagination: resData.pagination
    };
  },

  async createBom(payload: ICreateBomRequest): Promise<IMrpBomDto> {
    const response = await http.post<IResponse<IMrpBomDto>>("/supply_chain/manufacturing/mrpbom", payload);
    return (response.data.data ?? response.data) as IMrpBomDto;
  },

  async deleteBom(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/manufacturing/mrpbom/${id}`);
  },

  // Workcenters
  async getWorkcenters(): Promise<IMrpWorkcenterDto[]> {
    const response = await http.get<IResponse<IMrpWorkcenterDto[]>>("/supply_chain/manufacturing/mrpworkcenter");
    const data = response.data.data ?? response.data;
    if (Array.isArray(data)) return data;
    return (data as any)?.data || [];
  },

  async createWorkcenter(payload: Partial<IMrpWorkcenterDto>): Promise<IMrpWorkcenterDto> {
    const response = await http.post<IResponse<IMrpWorkcenterDto>>("/supply_chain/manufacturing/mrpworkcenter", payload);
    return (response.data.data ?? response.data) as IMrpWorkcenterDto;
  },

  async deleteWorkcenter(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/manufacturing/mrpworkcenter/${id}`);
  },

  // Helpers for Dropdowns
  async getProducts(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/supply_chain/inventory?all=true");
    const data = response.data.data ?? response.data;
    if (Array.isArray(data)) return data;
    return (data as any)?.data || [];
  },

  async getWarehouses(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/supply_chain/inventory/stockwarehouse");
    const data = response.data.data ?? response.data;
    if (Array.isArray(data)) return data;
    return (data as any)?.data || [];
  }
};
