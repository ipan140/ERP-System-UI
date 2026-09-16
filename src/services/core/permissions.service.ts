import { http } from "@/services/http";
import type { IResponse } from "@/types";
import type { ITogglePermissionRequestDto, IRolePermissionDto } from "@/types/core/permissions.dto";

export const permissionsService = {
  async getAll(params?: Record<string, any>): Promise<{ data: IRolePermissionDto[]; pagination?: any } | IRolePermissionDto[]> {
    const response = await http.get<any>("/core/permissions", { params });
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
