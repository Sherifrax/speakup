import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { SpeakUpActionParams } from "../../features/speakup/types/speakupTypes";

export const speakupActionSave = apiService.injectEndpoints({
  endpoints: (builder) => ({
    saveSpeakupAction: builder.mutation<void, SpeakUpActionParams>({
      query: (params) => ({
        url: baseModule.speakup + speakupUrls.action, 
        method: "POST",
        body: { params }, 
      }),
    }),
  }),
});

export const { useSaveSpeakupActionMutation } = speakupActionSave;
