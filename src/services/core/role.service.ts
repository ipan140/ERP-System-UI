import { http } from "@/services/http";
import type { IResponse } from "@/types";
import type { IRoleDto } from "@/types/core";

export const appRoleService = {
  async getAll(): Promise<IRoleDto[]> {
    const response = await http.get<IResponse<IRoleDto[]>>("/core/roles");
    return response.data.data ?? response.data; 
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
