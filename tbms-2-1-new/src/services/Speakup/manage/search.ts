import { apiService } from "../../apiService";
import { speakupUrls } from "../../../enum/api/speakup.enum";
import { baseModule } from "../../../enum/api/basemodules.enum";
import { SpeakUpSearchRequest, SpeakUpSearchResponse } from "../../../features/speakup/types/speakupTypes";
import { PaginationParams } from "../../../features/common/types/commonTypes";

export const speakUpSearch = apiService.injectEndpoints({
  endpoints: (builder) => ({
    searchSpeakUp: builder.mutation<
      SpeakUpSearchResponse,
      { search: SpeakUpSearchRequest; pagination: PaginationParams }
    >({
      query: ({ search, pagination }) => {
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

        return {
          url: baseModule.speakup + speakupUrls.SearchManage,
          method: "POST",
          params,
          body: search, // The search object already contains the params structure
        };
      },
    }),
  }),
});

export const { useSearchSpeakUpMutation } = speakUpSearch;


