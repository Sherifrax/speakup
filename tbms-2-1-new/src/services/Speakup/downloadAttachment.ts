import { apiService } from "../apiService";
import { baseModule } from "../../enum/api/basemodules.enum";

export const speakUpDownloadAttachment = apiService.injectEndpoints({
  endpoints: (builder) => ({
    downloadAttachment: builder.query<Blob, { fileName: string }>({
      query: ({ fileName }) => ({
        url: `${baseModule.speakup}api/speakup/download/${fileName}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useDownloadAttachmentQuery } = speakUpDownloadAttachment;

