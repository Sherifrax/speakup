import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { SpeakUpSubmitRequest, SpeakUpSubmitResponse } from "../../features/speakup/types/speakupTypes";

export const speakUpSubmit = apiService.injectEndpoints({
  endpoints: (builder) => ({
    submitSpeakUp: builder.mutation<SpeakUpSubmitResponse, SpeakUpSubmitRequest>({
      query: (submitData) => ({
        url: baseModule.speakup + speakupUrls.action,
        method: "POST",
        body: submitData,
      }),
    }),
  }),
});

export const { useSubmitSpeakUpMutation } = speakUpSubmit;


