import { apiService } from "../apiService";
import { SpeakUpUrls } from "../../enum/api/SpeakUp.enum";
import { SpeakUpSaveRequest, SpeakUpSaveResponse } from "../../features/speakUp/types/speakUpTypes";

export const speakUpSave = apiService.injectEndpoints({
  endpoints: (builder) => ({
    saveSpeakUp: builder.mutation<SpeakUpSaveResponse, SpeakUpSaveRequest>({
      query: (speakUpData) => ({
        url: SpeakUpUrls.Save,
        method: "PUT",
        body: speakUpData,
      }),
    }),
  }),
});

export const { useSaveSpeakUpMutation } = speakUpSave;

