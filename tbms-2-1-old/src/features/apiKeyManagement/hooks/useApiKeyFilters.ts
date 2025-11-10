// features/apiKeyManagement/hooks/useApiKeyFilters.ts
import { useState } from "react";
import { ApiKeyFilter } from "../types/apiKeyTypes";

export const useApiKeyFilters = () => {
  const [filters, setFilters] = useState<ApiKeyFilter>({
    isActive: "all",
    isIpCheck: "all",
    isCountryCheck: "all",
    isRegionCheck: "all",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Reset to first page when filters change
    return 1; // Return the page to reset to
  };

  const resetFilters = () => {
    setFilters({
      isActive: "all",
      isIpCheck: "all",
      isCountryCheck: "all",
      isRegionCheck: "all",
    });
    // Reset to first page when filters are reset
    return 1; // Return the page to reset to
  };

  return {
    filters,
    handleFilterChange,
    resetFilters,
  };
};
