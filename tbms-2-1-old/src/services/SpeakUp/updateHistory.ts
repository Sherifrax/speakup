import { apiService } from "../apiService";
import { SpeakUpUrls } from "../../enum/api/SpeakUp.enum";
import { SpeakUpUpdateHistoryRequest, SpeakUpUpdateHistoryResponse } from "../../features/speakUp/types/speakUpTypes";

export const speakUpUpdateHistory = apiService.injectEndpoints({
  endpoints: (builder) => ({
    updateSpeakUpHistory: builder.mutation<SpeakUpUpdateHistoryResponse, SpeakUpUpdateHistoryRequest>({
      query: (updateData) => ({
        url: SpeakUpUrls.UpdateHistory,
        method: "PUT",
        body: updateData,
      }),
    }),
  }),
});

export const { useUpdateSpeakUpHistoryMutation } = speakUpUpdateHistory;
