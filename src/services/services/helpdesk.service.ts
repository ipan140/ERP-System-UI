import { http } from "@/services/http";
import type { IResponse } from "@/types";
import type { ITicketDto, IHelpdeskSLADto, IHelpdeskCannedResponseDto } from "@/types/services";

export const helpdeskService = {
  // --- Tickets ---
  async getAll(): Promise<ITicketDto[]> {
    const response = await http.get<IResponse<ITicketDto[]>>("/services/helpdesk");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<ITicketDto> {
    const response = await http.get<IResponse<ITicketDto>>(`/services/helpdesk/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: Partial<ITicketDto>): Promise<ITicketDto> {
    const response = await http.post<IResponse<ITicketDto>>("/services/helpdesk", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: Partial<ITicketDto>): Promise<ITicketDto> {
    const response = await http.put<IResponse<ITicketDto>>(`/services/helpdesk/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/services/helpdesk/${id}`);
  },

  // --- SLA Policies ---
  async getSLAs(): Promise<IHelpdeskSLADto[]> {
    const response = await http.get<IResponse<IHelpdeskSLADto[]>>("/services/helpdesk/helpdesksla");
    return response.data.data ?? response.data;
  },

  async createSLA(payload: Partial<IHelpdeskSLADto>): Promise<IHelpdeskSLADto> {
    const response = await http.post<IResponse<IHelpdeskSLADto>>("/services/helpdesk/helpdesksla", payload);
    return response.data.data ?? response.data;
  },

  async updateSLA(id: number | string, payload: Partial<IHelpdeskSLADto>): Promise<IHelpdeskSLADto> {
    const response = await http.put<IResponse<IHelpdeskSLADto>>(`/services/helpdesk/helpdesksla/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async deleteSLA(id: number | string): Promise<void> {
    await http.delete(`/services/helpdesk/helpdesksla/${id}`);
  },

  // --- Canned Responses ---
  async getCannedResponses(): Promise<IHelpdeskCannedResponseDto[]> {
    const response = await http.get<IResponse<IHelpdeskCannedResponseDto[]>>("/services/helpdesk/helpdeskcannedresponse");
    return response.data.data ?? response.data;
  },

  async createCannedResponse(payload: Partial<IHelpdeskCannedResponseDto>): Promise<IHelpdeskCannedResponseDto> {
    const response = await http.post<IResponse<IHelpdeskCannedResponseDto>>("/services/helpdesk/helpdeskcannedresponse", payload);
    return response.data.data ?? response.data;
  },

  async updateCannedResponse(id: number | string, payload: Partial<IHelpdeskCannedResponseDto>): Promise<IHelpdeskCannedResponseDto> {
    const response = await http.put<IResponse<IHelpdeskCannedResponseDto>>(`/services/helpdesk/helpdeskcannedresponse/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async deleteCannedResponse(id: number | string): Promise<void> {
    await http.delete(`/services/helpdesk/helpdeskcannedresponse/${id}`);
  },
};

