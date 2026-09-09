import { http } from "@/services/http";
import type { IResponse, IPaginatedResponse } from "@/types";
import type {
  IProductDto,
  IInventorySummaryDto,
  IStockAdjustmentPayload,
  IInternalTransferPayload,
  IStockWarehouseDto,
  IProductCategoryDto,
  IUoMDto
} from "@/types/supply-chain/inventory.dto";

export const inventoryService = {
  async getAll(params?: Record<string, any>): Promise<{ data: IProductDto[]; pagination?: any }> {
    const response = await http.get<IPaginatedResponse<IProductDto[]>>("/supply_chain/inventory", { params });
    const resData = response.data as any;
    if (Array.isArray(resData)) {
      return { data: resData };
    }
    return {
      data: resData.data || [],
      pagination: resData.pagination
    };
  },

  async getSummary(): Promise<IInventorySummaryDto> {
    const response = await http.get<IResponse<IInventorySummaryDto>>("/supply_chain/inventory/summary");
    return (response.data.data ?? response.data) as IInventorySummaryDto;
  },

  async adjustStock(payload: IStockAdjustmentPayload): Promise<any> {
    const response = await http.post<IResponse<any>>("/supply_chain/inventory/adjustment", payload);
    return response.data.data ?? response.data;
  },

  async transferStock(payload: IInternalTransferPayload): Promise<any> {
    const response = await http.post<IResponse<any>>("/supply_chain/inventory/transfer", payload);
    return response.data.data ?? response.data;
  },

  async getWarehouses(): Promise<IStockWarehouseDto[]> {
    const response = await http.get<IResponse<IStockWarehouseDto[]>>("/supply_chain/inventory/stockwarehouse");
    return (response.data.data ?? response.data) || [];
  },

  async getCategories(): Promise<IProductCategoryDto[]> {
    const response = await http.get<IResponse<IProductCategoryDto[]>>("/supply_chain/inventory/productcategory");
    return (response.data.data ?? response.data) || [];
  },

  async getUoMs(): Promise<IUoMDto[]> {
    const response = await http.get<IResponse<IUoMDto[]>>("/supply_chain/inventory/uom");
    return (response.data.data ?? response.data) || [];
  },

  async getById(id: number | string): Promise<IProductDto> {
    const response = await http.get<IResponse<IProductDto>>(`/supply_chain/inventory/${id}`);
    return (response.data.data ?? response.data) as IProductDto;
  },

  async create(payload: any): Promise<IProductDto> {
    const response = await http.post<IResponse<IProductDto>>("/supply_chain/inventory", payload);
    return (response.data.data ?? response.data) as IProductDto;
  },

  async update(id: number | string, payload: any): Promise<IProductDto> {
    const response = await http.put<IResponse<IProductDto>>(`/supply_chain/inventory/${id}`, payload);
    return (response.data.data ?? response.data) as IProductDto;
  },

  async delete(id: number | string): Promise<void> {
    await http.delete(`/supply_chain/inventory/${id}`);
  },
};
