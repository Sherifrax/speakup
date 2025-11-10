import { apiService } from "../apiService";
import { SpeakUpUrls } from "../../enum/api/SpeakUp.enum";

export const speakUpDownloadAttachment = apiService.injectEndpoints({
  endpoints: (builder) => ({
    downloadAttachment: builder.query<Blob, { fileName: string }>({
      query: ({ fileName }) => ({
        url: `${SpeakUpUrls.DownloadAttachment || 'api/speakup/download'}/${fileName}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useDownloadAttachmentQuery } = speakUpDownloadAttachment;

