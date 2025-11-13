// CommonTypes.ts
export interface Profile {
  employeeName: string;
  designation: string;
  email: string;
  profilePhoto: string;
}

export interface SubMenuItem {
  subMenuId: string;
  subMenuName: string;
  iconName: string;
  url: string;
}

export interface ModuleMenu {
  menuId: string;
  moduleName: string;
  subMenu?: SubMenuItem[];
}

export interface ProfileResponse {
  profile?: Profile;
  modules?: ModuleMenu[];
  moduleName?: string;
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
