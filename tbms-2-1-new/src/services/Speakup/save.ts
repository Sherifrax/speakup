import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { SpeakUpSaveRequest, SpeakUpSaveResponse } from "../../features/speakup/types/speakupTypes";

export const speakUpSave = apiService.injectEndpoints({
  endpoints: (builder) => ({
    saveSpeakUp: builder.mutation<SpeakUpSaveResponse, SpeakUpSaveRequest>({
      query: (speakUpData) => ({
        url: baseModule.speakup + speakupUrls.Save,
        method: "PUT",
        body: speakUpData,
      }),
    }),
  }),
});

export const { useSaveSpeakUpMutation } = speakUpSave;
