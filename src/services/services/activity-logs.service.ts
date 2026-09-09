import { http } from "@/services/http";
import type { IResponse } from "@/types";
import type { IActivityLogDto } from "@/types/services";

export const activityLogsService = {
  async getByEntity(entityType: string, entityId: number | string, limit = 50): Promise<IActivityLogDto[]> {
    const response = await http.get<IResponse<IActivityLogDto[]>>("/services/activity-logs", {
      params: { entity_type: entityType, entity_id: entityId, limit }
    });
    return response.data.data || [];
  }
};
