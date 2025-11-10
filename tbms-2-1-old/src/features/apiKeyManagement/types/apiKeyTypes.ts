// features/apiKeyManagement/types/apiKeyTypes.ts
export interface ApiKey {
    apiKey: string | null;
    clientName: string;
    isActive: boolean;
    isIpCheck: boolean;
    isCountryCheck: boolean;
    isRegionCheck: boolean;
    btnEdit: boolean | null;
    btnPrint: boolean | null;
  }
  
  export type SortDirection = "asc" | "desc";
  
  export interface ApiKeyFilter {
    isActive: string;
    isIpCheck: string;
    isCountryCheck: string;
    isRegionCheck: string;
  }
  
  export interface ApiKeyFormData {
    apiKey: string | null;
    clientName: string;
    isActive: boolean;
    isIpCheck: boolean;
    isCountryCheck: boolean;
    isRegionCheck: boolean;
  }

  export interface ApiKeySearchParams {
  clientName?: string;
  isActive?: number;
  isIpCheck?: number;
  isCountryCheck?: number;
  isRegionCheck?: number;
}