// Common pagination + sorting params for all search APIs
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
