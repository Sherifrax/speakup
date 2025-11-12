import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { sanitizeNumber, sanitizeString } from "../../utils/sanitizers";
import { PaginationParams } from "../../features/common/types/commonTypes";
import { SpeakUpSearchParams, SpeakUpSearchResponse } from "../../features/speakup/types/speakupTypes";

export const speakupApprovalSearch = apiService.injectEndpoints({
  endpoints: (builder) => ({
    searchSpeakupApproval: builder.mutation<
      SpeakUpSearchResponse,
      { search: SpeakUpSearchParams; pagination: PaginationParams }
    >({
      query: ({ search, pagination }) => {
        const postFilters: SpeakUpSearchParams = {
          IsAnonymous: sanitizeNumber(search.IsAnonymous),
          compID: sanitizeNumber(search.compID),
          StatusID: sanitizeNumber(search.StatusID),
          TypeID: sanitizeNumber(search.TypeID),
          CommonSearchString: sanitizeString(search.CommonSearchString),
        };
        const params = {
          page: pagination.page ?? 1,
          size: pagination.size ?? 10,
          sortBy: pagination.sortBy ?? "ID",
          sortOrder: pagination.sortOrder ?? "asc",
        };

        const body = { params: postFilters };

        return {
          url: baseModule.speakup + speakupUrls.SearchApproval,
          method: "POST",
          params,
          body,
        };
      },
    }),
  }),
});

export const { useSearchSpeakupApprovalMutation } = speakupApprovalSearch;

