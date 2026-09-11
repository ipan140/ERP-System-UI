import { http } from "@/services/http";
import type { IResponse, IPaginatedResponse } from "@/types";
import type {
  IPlmEcoDto,
  IPlmEcoTypeDto,
  IPlmSummary,
  ICreateEcoPayload,
  IUpdateEcoStatePayload,
} from "@/types/supply-chain/plm.dto";

export const plmService = {
  async getSummary(): Promise<IPlmSummary> {
    const response = await http.get<IResponse<IPlmSummary>>("/supply_chain/plm/summary");
    return response.data.data;
  },

  async getAll(params?: { page?: number; limit?: number; search?: string; state?: string }): Promise<IPaginatedResponse<IPlmEcoDto[]>> {
    const response = await http.get<IPaginatedResponse<IPlmEcoDto[]>>("/supply_chain/plm", { params });
    return response.data;
  },

  async getTypes(): Promise<IPlmEcoTypeDto[]> {
    const response = await http.get<IResponse<IPlmEcoTypeDto[]>>("/supply_chain/plm/types");
    return response.data.data;
  },

  async getById(id: number | string): Promise<IPlmEcoDto> {
    const response = await http.get<IResponse<IPlmEcoDto>>(`/supply_chain/plm/${id}`);
    return response.data.data;
  },

  async create(payload: ICreateEcoPayload): Promise<IPlmEcoDto> {
    const response = await http.post<IResponse<IPlmEcoDto>>("/supply_chain/plm", payload);
    return response.data.data;
  },

  async updateState(id: number | string, payload: IUpdateEcoStatePayload): Promise<IPlmEcoDto> {
    const response = await http.put<IResponse<IPlmEcoDto>>(`/supply_chain/plm/${id}/state`, payload);
    return response.data.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/plm/${id}`);
  },
};
