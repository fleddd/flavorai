export interface PaginatedResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchParams {
  query?: string;
  cuisines?: string[];
  timeMin?: number;
  timeMax?: number;
  ingredients?: string[];
  page?: number;
  limit?: number;
}
