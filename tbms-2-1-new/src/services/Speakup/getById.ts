import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { SpeakUpGetByIdResponse } from "../../features/speakup/types/speakupTypes";

export const speakUpGetById = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getSpeakUpById: builder.query<
      SpeakUpGetByIdResponse,
      { payload: string; compId?: number }
    >({
      query: ({ payload, compId = -1 }) => ({
        url: baseModule.speakup + speakupUrls.Get,
        method: "POST",
        body: {
          params: {
            payload,
            compId,
          },
        },
      }),
    }),
  }),
});

export const { useGetSpeakUpByIdQuery } = speakUpGetById;
