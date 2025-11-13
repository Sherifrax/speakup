import { apiService } from "../apiService";
import { baseModule } from "../../enum/api/basemodules.enum";

export interface DownloadDocumentRequest {
  params: {
    fileName: string;
  };
}

export const downloadDocumentApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    downloadDocument: builder.mutation<Blob, DownloadDocumentRequest>({
      query: (body) => ({
        url: `${baseModule.common}api/doc/download`,
        method: "POST",
        body,
        responseHandler: (response) => response.blob(),
        prepareHeaders: (headers: Headers) => {
          // Explicitly set Content-Type for JSON request
          headers.set("Content-Type", "application/json");
          return headers;
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useDownloadDocumentMutation } = downloadDocumentApi;

