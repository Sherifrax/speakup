// CommonTypes.ts
export interface Profile {
  EmployeeName: string;
  Designation: string;
  Email: string;
  ProfilePhoto: string;
}

export interface MenuItem {
  MenuName: string;
  IconName: string;
  Url: string;
}

export interface ProfileResponse {
  profile: Profile;
  menu: MenuItem[];
  moduleName: string;
}

export type SortDirection = "asc" | "desc";

export interface KeyValuePair {
  key: string;
  value: string;
  sortOrder?: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
