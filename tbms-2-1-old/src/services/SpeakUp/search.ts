import { apiService } from "../apiService";
import { SpeakUpUrls } from "../../enum/api/SpeakUp.enum";
import { SpeakUpSearchRequest, SpeakUpSearchResponse } from "../../features/speakUp/types/speakUpTypes";
import { PaginationParams } from "../../types/pagination";

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
          url: SpeakUpUrls.SearchEntry,
          method: "POST",
          params,
          body: search, // The search object already contains the params structure
        };
      },
    }),
  }),
});

export const { useSearchSpeakUpMutation } = speakUpSearch;

