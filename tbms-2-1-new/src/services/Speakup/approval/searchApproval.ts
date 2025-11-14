import { apiService } from "../../apiService";
import { speakupUrls } from "../../../enum/api/speakup.enum";
import { baseModule } from "../../../enum/api/basemodules.enum";
import { sanitizeNumber, sanitizeString } from "../../../utils/sanitizers";
import { PaginationParams } from "../../../features/common/types/commonTypes";
import { SpeakUpSearchParams, SpeakUpSearchResponse } from "../../../features/speakup/types/speakupTypes";

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
        
        const params: Record<string, any> = {
          page: pagination.page ?? 1,
          size: pagination.size ?? 10,
        };

        // Only include sortBy and sortOrder if they are explicitly provided
        if (pagination.sortBy) {
          params.sortBy = pagination.sortBy;
        }
        if (pagination.sortOrder) {
          params.sortOrder = pagination.sortOrder;
        }

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

