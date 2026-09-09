import { http } from "@/services/http";
import type { IResponse, IPaginatedResponse } from "@/types";
import type {
  IMaintenanceSummary,
  IMaintenanceRequestDto,
  IMaintenanceEquipmentDto,
  ICreateMaintenanceRequestPayload,
  IUpdateMaintenanceStatePayload,
  ICreateMaintenanceEquipmentPayload,
} from "@/types/supply-chain/maintenance.dto";

export const maintenanceService = {
  async getSummary(): Promise<IMaintenanceSummary> {
    const response = await http.get<IResponse<IMaintenanceSummary>>("/supply_chain/maintenance/summary");
    return response.data.data;
  },

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    state?: string;
    type?: string;
  }): Promise<{ data: IMaintenanceRequestDto[]; pagination: any }> {
    const response = await http.get<IPaginatedResponse<IMaintenanceRequestDto[]>>("/supply_chain/maintenance", {
      params,
    });
    return {
      data: response.data.data || [],
      pagination: response.data.pagination,
    };
  },

  async getById(id: number | string): Promise<IMaintenanceRequestDto> {
    const response = await http.get<IResponse<IMaintenanceRequestDto>>(`/supply_chain/maintenance/${id}`);
    return response.data.data;
  },

  async create(payload: ICreateMaintenanceRequestPayload): Promise<IMaintenanceRequestDto> {
    const response = await http.post<IResponse<IMaintenanceRequestDto>>("/supply_chain/maintenance", payload);
    return response.data.data;
  },

  async updateState(id: number | string, payload: IUpdateMaintenanceStatePayload): Promise<IMaintenanceRequestDto> {
    const response = await http.put<IResponse<IMaintenanceRequestDto>>(`/supply_chain/maintenance/${id}/state`, payload);
    return response.data.data;
  },

  async update(id: number | string, payload: any): Promise<IMaintenanceRequestDto> {
    const response = await http.put<IResponse<IMaintenanceRequestDto>>(`/supply_chain/maintenance/${id}`, payload);
    return response.data.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/maintenance/${id}`);
  },

  async getEquipments(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ data: IMaintenanceEquipmentDto[]; pagination: any }> {
    const response = await http.get<IPaginatedResponse<IMaintenanceEquipmentDto[]>>("/supply_chain/maintenance/equipment", {
      params,
    });
    return {
      data: response.data.data || [],
      pagination: response.data.pagination,
    };
  },

  async createEquipment(payload: ICreateMaintenanceEquipmentPayload): Promise<IMaintenanceEquipmentDto> {
    const response = await http.post<IResponse<IMaintenanceEquipmentDto>>("/supply_chain/maintenance/equipment", payload);
    return response.data.data;
  },

  async deleteEquipment(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/maintenance/equipment/${id}`);
  },
};

