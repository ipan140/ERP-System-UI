import { http } from "@/services/http";
import type { IResponse } from "@/types";
import type { IDepartmentDto } from "@/types/hr/employees.dto";

export const departmentsService = {
  async getAll(): Promise<IDepartmentDto[]> {
    const response = await http.get<IResponse<IDepartmentDto[]>>("/hr/employees/department");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<IDepartmentDto> {
    const response = await http.get<IResponse<IDepartmentDto>>(`/hr/employees/department/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: IDepartmentDto): Promise<IDepartmentDto> {
    const response = await http.post<IResponse<IDepartmentDto>>("/hr/employees/department", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: IDepartmentDto): Promise<IDepartmentDto> {
    const response = await http.put<IResponse<IDepartmentDto>>(`/hr/employees/department/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/hr/employees/department/${id}`);
  },
};
