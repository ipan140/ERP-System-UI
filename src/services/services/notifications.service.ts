import { http } from "@/services/http";
import type { IResponse } from "@/types";
import type { INotificationLogDto } from "@/types/services";

export const notificationsService = {
  async getLogs(limit = 50): Promise<INotificationLogDto[]> {
    const response = await http.get<IResponse<INotificationLogDto[]>>("/services/notifications/logs", {
      params: { limit }
    });
    return response.data.data || [];
  },

  async send(payload: Partial<INotificationLogDto>): Promise<any> {
    const response = await http.post<IResponse<any>>("/services/notifications/send", payload);
    return response.data.data || response.data;
  }
};
