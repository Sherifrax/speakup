import { apiService } from "../apiService";
import { SpeakUpUrls } from "../../enum/api/SpeakUp.enum";
import { SpeakUpSubmitRequest, SpeakUpSubmitResponse } from "../../features/speakUp/types/speakUpTypes";

export const speakUpSubmit = apiService.injectEndpoints({
  endpoints: (builder) => ({
    submitSpeakUp: builder.mutation<SpeakUpSubmitResponse, SpeakUpSubmitRequest>({
      query: (submitData) => ({
        url: SpeakUpUrls.Action,
        method: "POST",
        body: submitData,
      }),
    }),
  }),
});

export const { useSubmitSpeakUpMutation } = speakUpSubmit;

