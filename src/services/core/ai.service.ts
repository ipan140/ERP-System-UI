import { http } from "@/services/http";
import type { IResponse } from "@/types";

export interface AIConfigData {
  id?: number;
  active_provider: string;
  gemini_api_key?: string;
  gemini_model?: string;
  gemini_configured?: boolean;
  gemini_from_env?: boolean;
  openai_api_key?: string;
  openai_model?: string;
  openai_base_url?: string;
  openai_configured?: boolean;
  openai_from_env?: boolean;
  claude_api_key?: string;
  claude_model?: string;
  claude_configured?: boolean;
  claude_from_env?: boolean;
  deepseek_api_key?: string;
  deepseek_model?: string;
  deepseek_base_url?: string;
  deepseek_configured?: boolean;
  deepseek_from_env?: boolean;
  ollama_base_url?: string;
  ollama_model?: string;
  ollama_configured?: boolean;
}

export const artificialIntelligenceService = {
  async getAll(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/artificial_intelligence");
    return response.data.data ?? response.data;
  },

  async getById(id: number | string): Promise<any> {
    const response = await http.get<IResponse<any>>(`/artificial_intelligence/${id}`);
    return response.data.data ?? response.data;
  },

  async create(payload: any): Promise<any> {
    const response = await http.post<IResponse<any>>("/artificial_intelligence", payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<any> {
    const response = await http.put<IResponse<any>>(`/artificial_intelligence/${id}`, payload);
    return response.data.data ?? response.data;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/artificial_intelligence/${id}`);
  },

  async getConfig(): Promise<AIConfigData> {
    const response = await http.get<IResponse<AIConfigData>>("/artificial_intelligence/config");
    return response.data.data ?? (response.data as any);
  },

  async saveConfig(payload: Partial<AIConfigData>): Promise<any> {
    const response = await http.post<IResponse<any>>("/artificial_intelligence/config", payload);
    return response.data.data ?? response.data;
  },

  async generate(payload: { prompt_id?: number; provider?: string; model?: string; system?: string; input?: string }): Promise<any> {
    const response = await http.post<IResponse<any>>("/artificial_intelligence/generate", payload);
    return response.data.data ?? response.data;
  },
};

