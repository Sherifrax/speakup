import { apiService } from "../apiService";
import { SpeakUpUrls } from "../../enum/api/SpeakUp.enum";
import { SpeakUpFiltersResponse } from "../../features/speakUp/types/speakUpTypes";

export const speakUpGetFilters = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getSpeakUpFilters: builder.query<SpeakUpFiltersResponse, void>({
      query: () => ({
        url: SpeakUpUrls.GetFilters,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSpeakUpFiltersQuery } = speakUpGetFilters;

