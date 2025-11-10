import { apiService } from "../apiService";
import { SpeakUpUrls } from "../../enum/api/SpeakUp.enum";
import { SpeakUpHistoryResponse } from "../../features/speakUp/types/speakUpTypes";

export const speakUpGetHistory = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getSpeakUpHistory: builder.query<
      SpeakUpHistoryResponse,
      { payload: string }
    >({
      query: ({ payload }) => ({
        url: SpeakUpUrls.GetHistory,
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

