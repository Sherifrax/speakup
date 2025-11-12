import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { SpeakUpHistorySaveParams } from "../../features/speakup/types/speakupTypes";

export const speakupHistorySave = apiService.injectEndpoints({
  endpoints: (builder) => ({
    saveSpeakupHistory: builder.mutation<void, SpeakUpHistorySaveParams>({
      query: (params) => ({
        url: baseModule.speakup + speakupUrls.UpdateHistory, 
        method: "POST",
        body: { params }, 
      }),
    }),
  }),
});

export const { useSaveSpeakupHistoryMutation } = speakupHistorySave;
