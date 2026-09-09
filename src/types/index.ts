export interface IResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface IPaginationMeta {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface IPaginatedResponse<T> extends IResponse<T> {
  pagination?: IPaginationMeta;
}
