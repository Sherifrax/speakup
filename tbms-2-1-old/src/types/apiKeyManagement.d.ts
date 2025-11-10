// src/types/apiKeyManagement.d.ts
export type SortDirection = "asc" | "desc";

export interface ApiKey {
  apiKey: string | null;
  clientName: string;
  isActive: boolean;
  isIpCheck: boolean;
  isCountryCheck: boolean;
  isRegionCheck: boolean;
}

export interface ApiKeyFilters {
  isActive: 'all' | 'yes' | 'no';
  isIpCheck: 'all' | 'yes' | 'no';
  isCountryCheck: 'all' | 'yes' | 'no';
  isRegionCheck: 'all' | 'yes' | 'no';
}

export type SaveStatus = "idle" | "saving" | "success" | "error";