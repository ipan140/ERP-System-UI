import { http } from "@/services/http";
import type { IResponse } from "@/types";
import type { IScmDashboardSummary, IScmCalendarEvent } from "@/types/supply-chain/dashboard.dto";

export const scmDashboardService = {
  async getSummary(): Promise<IScmDashboardSummary> {
    const response = await http.get<IResponse<IScmDashboardSummary>>("/supply_chain/dashboard/summary");
    return response.data.data;
  },

  async getCalendarEvents(): Promise<IScmCalendarEvent[]> {
    const response = await http.get<IResponse<IScmCalendarEvent[]>>("/supply_chain/dashboard/calendar-events");
    return response.data.data;
  },
};
