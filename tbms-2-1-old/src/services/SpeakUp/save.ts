import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { SpeakUpSaveParams } from "../../features/speakup/types/speakupTypes";

export const speakupSave = apiService.injectEndpoints({
  endpoints: (builder) => ({
    saveSpeakup: builder.mutation<void, SpeakUpSaveParams>({
      query: (params) => ({
        url: baseModule.speakup + speakupUrls.Save, 
        method: "POST",
        body: { params }, 
      }),
    }),
  }),
});

export const { useSaveSpeakupMutation } = speakupSave;
