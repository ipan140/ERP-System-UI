import { http } from "@/services/http";
import type { IResponse } from "@/types";
import type { IProjectDto, IProjectMilestoneDto, IResourceForecastDto } from "@/types/services";

export const projectService = {
  // --- Projects ---
  async getAll(params?: any): Promise<any> {
    const response = await http.get<any>("/services/project", { params: params || { all: true } });
    if (!params || params.all) {
      return response.data?.data ?? response.data;
    }
    return response.data;
  },

  async getById(id: number | string): Promise<IProjectDto> {
    const response = await http.get<IResponse<IProjectDto>>(`/services/project/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: Partial<IProjectDto>): Promise<IProjectDto> {
    const response = await http.post<IResponse<IProjectDto>>("/services/project", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: Partial<IProjectDto>): Promise<IProjectDto> {
    const response = await http.put<IResponse<IProjectDto>>(`/services/project/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/services/project/${id}`);
  },

  // --- Project Milestones ---
  async getMilestones(): Promise<IProjectMilestoneDto[]> {
    const response = await http.get<IResponse<IProjectMilestoneDto[]>>("/services/project/projectmilestone");
    return response.data.data ?? response.data;
  },

  async createMilestone(payload: Partial<IProjectMilestoneDto>): Promise<IProjectMilestoneDto> {
    const response = await http.post<IResponse<IProjectMilestoneDto>>("/services/project/projectmilestone", payload);
    return response.data.data ?? response.data;
  },

  async updateMilestone(id: number | string, payload: Partial<IProjectMilestoneDto>): Promise<IProjectMilestoneDto> {
    const response = await http.put<IResponse<IProjectMilestoneDto>>(`/services/project/projectmilestone/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async deleteMilestone(id: number | string): Promise<void> {
    await http.delete(`/services/project/projectmilestone/${id}`);
  },

  // --- Resource Forecasts ---
  async getResourceForecasts(): Promise<IResourceForecastDto[]> {
    const response = await http.get<IResponse<IResourceForecastDto[]>>("/services/project/resourceforecast");
    return response.data.data ?? response.data;
  },

  async createResourceForecast(payload: Partial<IResourceForecastDto>): Promise<IResourceForecastDto> {
    const response = await http.post<IResponse<IResourceForecastDto>>("/services/project/resourceforecast", payload);
    return response.data.data ?? response.data;
  },

  async deleteResourceForecast(id: number | string): Promise<void> {
    await http.delete(`/services/project/resourceforecast/${id}`);
  },

  // --- Tasks ---
  async getTasks(): Promise<ITaskDto[]> {
    const response = await http.get<IResponse<ITaskDto[]>>("/services/project/task");
    return response.data.data ?? response.data;
  },

  async createTask(payload: Partial<ITaskDto>): Promise<ITaskDto> {
    const response = await http.post<IResponse<ITaskDto>>("/services/project/task", payload);
    return response.data.data ?? response.data;
  },

  async updateTask(id: number | string, payload: Partial<ITaskDto>): Promise<ITaskDto> {
    const response = await http.put<IResponse<ITaskDto>>(`/services/project/task/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async deleteTask(id: number | string): Promise<void> {
    await http.delete(`/services/project/task/${id}`);
  },
};


