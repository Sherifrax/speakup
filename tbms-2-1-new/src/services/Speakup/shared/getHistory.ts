import { apiService } from "../../apiService";
import { speakupUrls } from "../../../enum/api/speakup.enum";
import { baseModule } from "../../../enum/api/basemodules.enum";
import { SpeakUpHistoryResponse } from "../../../features/speakup/types/speakupTypes";

export const speakUpGetHistory = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getSpeakUpHistory: builder.query<
      SpeakUpHistoryResponse,
      { payload: string }
    >({
      query: ({ payload }) => ({
        url: baseModule.speakup + speakupUrls.GetHistory,
        method: "POST",
        body: {
          params: {
            payload,
          },
        },
      }),
    }),
  }),
});

export const { useGetSpeakUpHistoryQuery } = speakUpGetHistory;


