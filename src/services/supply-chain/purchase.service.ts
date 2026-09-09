import { http } from "@/services/http";
import type { IResponse, IPaginatedResponse } from "@/types";
import type {
  IPurchaseOrderDto,
  IPurchaseSummaryDto,
  ICreatePOPayload,
  IReceiveGoodsPayload
} from "@/types/supply-chain/purchase.dto";

export const purchaseService = {
  async getAll(params?: Record<string, any>): Promise<{ data: IPurchaseOrderDto[]; pagination?: any }> {
    const response = await http.get<IPaginatedResponse<IPurchaseOrderDto[]>>("/supply_chain/purchase", { params });
    const resData = response.data as any;
    if (Array.isArray(resData)) {
      return { data: resData };
    }
    return {
      data: resData.data || [],
      pagination: resData.pagination
    };
  },

  async getSummary(): Promise<IPurchaseSummaryDto> {
    const response = await http.get<IResponse<IPurchaseSummaryDto>>("/supply_chain/purchase/summary");
    return (response.data.data ?? response.data) as IPurchaseSummaryDto;
  },

  async getById(id: number | string): Promise<IPurchaseOrderDto> {
    const response = await http.get<IResponse<IPurchaseOrderDto>>(`/supply_chain/purchase/${id}`);
    return (response.data.data ?? response.data) as IPurchaseOrderDto;
  },

  async create(payload: ICreatePOPayload | any): Promise<IPurchaseOrderDto> {
    const response = await http.post<IResponse<IPurchaseOrderDto>>("/supply_chain/purchase", payload);
    return (response.data.data ?? response.data) as IPurchaseOrderDto;
  },

  async confirm(id: number | string): Promise<IPurchaseOrderDto> {
    const response = await http.post<IResponse<IPurchaseOrderDto>>(`/supply_chain/purchase/${id}/confirm`);
    return (response.data.data ?? response.data) as IPurchaseOrderDto;
  },

  async approve(id: number | string): Promise<IPurchaseOrderDto> {
    const response = await http.post<IResponse<IPurchaseOrderDto>>(`/supply_chain/purchase/${id}/approve`);
    return (response.data.data ?? response.data) as IPurchaseOrderDto;
  },

  async receiveGoods(id: number | string, payload: IReceiveGoodsPayload): Promise<any> {
    const response = await http.post<IResponse<any>>(`/supply_chain/purchase/${id}/receive`, payload);
    return response.data.data ?? response.data;
  },

  async update(id: number | string, payload: any): Promise<IPurchaseOrderDto> {
    const response = await http.put<IResponse<IPurchaseOrderDto>>(`/supply_chain/purchase/${id}`, payload);
    return (response.data.data ?? response.data) as IPurchaseOrderDto;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/purchase/${id}`);
  },

  async getVendors(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/base/partner");
    const data = response.data.data ?? response.data;
    if (Array.isArray(data)) return data;
    return (data as any)?.data || [];
  },

  async getProducts(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/supply_chain/inventory?all=true");
    const data = response.data.data ?? response.data;
    if (Array.isArray(data)) return data;
    return (data as any)?.data || [];
  },

  async getWarehouses(): Promise<any[]> {
    const response = await http.get<IResponse<any[]>>("/supply_chain/inventory/stockwarehouse");
    const data = response.data.data ?? response.data;
    if (Array.isArray(data)) return data;
    return (data as any)?.data || [];
  }
};
