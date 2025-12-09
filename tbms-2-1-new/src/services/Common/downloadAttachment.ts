import { apiService } from "../apiService";
import { baseModule } from "../../enum/api/basemodules.enum";
import { DocumentUrls } from "../../enum/api/document.enum";

export interface DownloadAttachmentParams {
  fileName: string;
}

export const speakUpDownloadAttachment = apiService.injectEndpoints({
  endpoints: (builder) => ({
    downloadAttachment: builder.mutation<Blob, DownloadAttachmentParams>({
      query: ({ fileName }) => {
        const body = {
          params: {
            fileName: fileName,
          },
        };
        
        // Construct the full URL to ensure it's correct
        const url = `${baseModule.common}${DocumentUrls.DOWNLOAD}`;
        
        return {
          url,
          method: "POST",
          body,
          responseHandler: async (response) => {
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Download failed: ${response.status} ${errorText}`);
            }
            return response.blob();
          },
          // Explicitly set Content-Type for JSON request body
          prepareHeaders: (headers: Headers) => {
            headers.set("Content-Type", "application/json");
            return headers;
          },
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useDownloadAttachmentMutation } = speakUpDownloadAttachment;

