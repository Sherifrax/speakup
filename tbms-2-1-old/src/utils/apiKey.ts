// features/apiKeyManagement/utils/apiKeyUtils.ts
import { ApiKey, ApiKeyFilter, SortDirection } from "../features/apiKeyManagement/types/apiKeyTypes";

export const filterApiKeys = (
  apiKeys: ApiKey[],
  searchQuery: string,
  filters: ApiKeyFilter
): ApiKey[] => {
  return apiKeys.filter((key) => {
    const matchesSearch = key.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive =
      filters.isActive === "all" ||
      (filters.isActive === "yes" && key.isActive) ||
      (filters.isActive === "no" && !key.isActive);
    const matchesIpCheck =
      filters.isIpCheck === "all" ||
      (filters.isIpCheck === "yes" && key.isIpCheck) ||
      (filters.isIpCheck === "no" && !key.isIpCheck);
    const matchesCountryCheck =
      filters.isCountryCheck === "all" ||
      (filters.isCountryCheck === "yes" && key.isCountryCheck) ||
      (filters.isCountryCheck === "no" && !key.isCountryCheck);
    const matchesRegionCheck =
      filters.isRegionCheck === "all" ||
      (filters.isRegionCheck === "yes" && key.isRegionCheck) ||
      (filters.isRegionCheck === "no" && !key.isRegionCheck);
    
    return matchesSearch && matchesActive && matchesIpCheck && matchesCountryCheck && matchesRegionCheck;
  });
};

export const sortApiKeys = (
  apiKeys: ApiKey[],
  sortColumn: string | null,
  sortDirection: SortDirection
): ApiKey[] => {
  if (!sortColumn) return apiKeys;

  return [...apiKeys].sort((a, b) => {
    let aValue: any = a[sortColumn as keyof ApiKey];
    let bValue: any = b[sortColumn as keyof ApiKey];

    if (aValue === null || aValue === undefined) return sortDirection === "asc" ? -1 : 1;
    if (bValue === null || bValue === undefined) return sortDirection === "asc" ? 1 : -1;

    if (typeof aValue === "boolean") aValue = aValue ? 1 : 0;
    if (typeof bValue === "boolean") bValue = bValue ? 1 : 0;

    if (typeof aValue === "string") aValue = aValue.trim().toLowerCase();
    if (typeof bValue === "string") bValue = bValue.trim().toLowerCase();

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};

export const paginateApiKeys = (
  apiKeys: ApiKey[],
  currentPage: number,
  itemsPerPage: number
): ApiKey[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return apiKeys.slice(startIndex, startIndex + itemsPerPage);
};