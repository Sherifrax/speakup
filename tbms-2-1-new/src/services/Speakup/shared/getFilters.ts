import { apiService } from "../../apiService";
import { speakupUrls } from "../../../enum/api/speakup.enum";
import { baseModule } from "../../../enum/api/basemodules.enum";
import { SpeakUpFiltersResponse } from "../../../features/speakup/types/speakupTypes";

export const speakUpGetFilters = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getSpeakUpFilters: builder.query<SpeakUpFiltersResponse, void>({
      query: () => ({
        url: baseModule.speakup + speakupUrls.Filters,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSpeakUpFiltersQuery } = speakUpGetFilters;

