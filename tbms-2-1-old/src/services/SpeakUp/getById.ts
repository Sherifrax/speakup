import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { SpeakUpGet } from "../../features/speakup/types/speakupTypes";

// API endpoint definition
export const speakupGetById = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getSpeakupById: builder.mutation<SpeakUpGet, { encryptedData: string }>({
      query: (body) => ({
        url: baseModule.speakup + speakupUrls.Get, 
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetSpeakupByIdMutation } = speakupGetById;
