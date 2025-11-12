import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";

export interface UpdateHistoryPayloadRequest {
  params: {
    payload: string;
    message: string;
    compId?: number;
  };
}

export interface UpdateHistoryPayloadResponse {
  data?: Array<{ Status?: string }>;
  message?: string;
}

export const updateHistoryPayloadApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    updateHistoryByPayload: builder.mutation<UpdateHistoryPayloadResponse, UpdateHistoryPayloadRequest>({
      query: (body) => ({
        url: baseModule.speakup + speakupUrls.UpdateHistory,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useUpdateHistoryByPayloadMutation } = updateHistoryPayloadApi;


