import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { SpeakUpSearchRequest, SpeakUpSearchResponse } from "../../features/speakup/types/speakupTypes";
import { PaginationParams } from "../../features/common/types/commonTypes";

export const speakUpSearch = apiService.injectEndpoints({
  endpoints: (builder) => ({
    searchSpeakUp: builder.mutation<
      SpeakUpSearchResponse,
      { search: SpeakUpSearchRequest; pagination: PaginationParams }
    >({
      query: ({ search, pagination }) => {
        const params = {
          page: pagination.page ?? 1,
          size: pagination.size ?? 10,
          sortBy: pagination.sortBy ?? "id",
          sortOrder: pagination.sortOrder ?? "asc",
        };

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


