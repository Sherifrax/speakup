import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { SpeakUpFilter } from "../../features/speakup/types/speakupTypes";

export const speakupFilter = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getSpeakupFilter: builder.query<SpeakUpFilter, void>({
      query: () => ({
        url: baseModule.speakup + speakupUrls.Filters,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSpeakupFilterQuery } = speakupFilter;
