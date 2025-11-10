import { apiService } from "../apiService";
import { ApiKeyUrls } from "../../enum/api/ApiKey.enum";
import { ApiKey } from "../../features/apiKeyManagement/types/apiKeyTypes";
import { PaginationParams } from "../../types/pagination";
import { ApiKeySearchParams } from "../../features/apiKeyManagement/types/apiKeyTypes";
import { sanitizeNumber, sanitizeString } from "../../utils/sanitizers";

export const apiKeySearch = apiService.injectEndpoints({
  endpoints: (builder) => ({
    searchApiKeys: builder.mutation<
      ApiKey[],
      { search: ApiKeySearchParams; pagination: PaginationParams }
    >({
      query: ({ search, pagination }) => {
       
        const postFilters: ApiKeySearchParams = {
          clientName: sanitizeString(search.clientName),
          isActive: sanitizeNumber(search.isActive),
          isIpCheck: sanitizeNumber(search.isIpCheck),
          isCountryCheck: sanitizeNumber(search.isCountryCheck),
          isRegionCheck: sanitizeNumber(search.isRegionCheck),
        };
        const params = {
          page: pagination.page ?? 1,
          size: pagination.size ?? 10,
          "sort-by": pagination.sortBy ?? "clientName",
          "sort-order": pagination.sortOrder ?? "asc",
        };

        const body = postFilters;

        return {
          url: ApiKeyUrls.Searchp,
          method: "POST",
          params,
          body,
        };
      },
    }),
  }),
});

export const { useSearchApiKeysMutation } = apiKeySearch;
