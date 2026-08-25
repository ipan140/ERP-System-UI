import { http } from "./http";
import type { IResponse, IRoleDto } from "@/types";

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
