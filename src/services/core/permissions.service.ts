import { http } from "@/services/http";
import type { IResponse } from "@/types";
import type { ITogglePermissionRequestDto, IRolePermissionDto } from "@/types/core/permissions.dto";

export const permissionsService = {
  async getAll(): Promise<IRolePermissionDto[]> {
    const response = await http.get<IResponse<IRolePermissionDto[]>>("/core/permissions");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<IRolePermissionDto> {
    const response = await http.get<IResponse<IRolePermissionDto>>(`/core/permissions/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: Partial<IRolePermissionDto>): Promise<IRolePermissionDto> {
    const response = await http.post<IResponse<IRolePermissionDto>>("/core/permissions", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: Partial<IRolePermissionDto>): Promise<IRolePermissionDto> {
    const response = await http.put<IResponse<IRolePermissionDto>>(`/core/permissions/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/core/permissions/${id}`);
  },

  async toggle(payload: ITogglePermissionRequestDto): Promise<IRolePermissionDto> {
    const response = await http.post<IResponse<IRolePermissionDto>>("/core/permissions/toggle", payload);
    return response.data.data ?? response.data;
  }
};
