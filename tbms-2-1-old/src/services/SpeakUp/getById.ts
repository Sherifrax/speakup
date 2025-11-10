import { apiService } from "../apiService";
import { SpeakUpUrls } from "../../enum/api/SpeakUp.enum";
import { SpeakUpGetByIdResponse } from "../../features/speakUp/types/speakUpTypes";

export const speakUpGetById = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getSpeakUpById: builder.query<
      SpeakUpGetByIdResponse,
      { payload: string; compId?: number }
    >({
      query: ({ payload, compId = -1 }) => ({
        url: SpeakUpUrls.GetById,
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

