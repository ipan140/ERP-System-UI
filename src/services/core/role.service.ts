import { http } from "@/services/http";
import type { IResponse } from "@/types";
import type { IRoleDto } from "@/types/core";

export const appRoleService = {
  async getAll(params?: Record<string, any>): Promise<{ data: IRoleDto[]; pagination?: any } | IRoleDto[]> {
    const response = await http.get<any>("/core/roles", { params });
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

  async create(role: IRoleDto): Promise<IRoleDto> {
    const response = await http.post<IResponse<IRoleDto>>("/core/roles", role);
    return response.data.data ?? response.data;
  },

  async update(pk: number, role: IRoleDto): Promise<IRoleDto> {
    const response = await http.put<IResponse<IRoleDto>>(`/core/roles/${pk}`, role);
    return response.data.data ?? response.data;
  },

  async delete(pk: number): Promise<void> {
    await http.delete(`/core/roles/${pk}`);
  },
};
