import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { SpeakUpUpdateHistoryRequest, SpeakUpUpdateHistoryResponse } from "../../features/speakup/types/speakupTypes";

export const speakUpUpdateHistory = apiService.injectEndpoints({
  endpoints: (builder) => ({
    updateSpeakUpHistory: builder.mutation<SpeakUpUpdateHistoryResponse, SpeakUpUpdateHistoryRequest>({
      query: (updateData) => ({
        url: baseModule.speakup + speakupUrls.UpdateHistory,
        method: "PUT",
        body: updateData,
      }),
    }),
  }),
});

export const { useUpdateSpeakUpHistoryMutation } = speakUpUpdateHistory;


