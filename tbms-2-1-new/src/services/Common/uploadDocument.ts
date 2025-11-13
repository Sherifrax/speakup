import { apiService } from "../apiService";
import { baseModule } from "../../enum/api/basemodules.enum";

export interface UploadDocumentResponse {
  fileName?: string;
  message?: string;
  [key: string]: any;
}

export const uploadDocumentApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    uploadDocument: builder.mutation<UploadDocumentResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        
        const token = localStorage.getItem("token") || "";
        
        return {
          url: `${baseModule.common}api/doc/upload`,
          method: "POST",
          body: formData,
          prepareHeaders: (headers: Headers) => {
            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
            }
            // Don't set Content-Type - browser will set it automatically with boundary for multipart/form-data
            return headers;
          },
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useUploadDocumentMutation } = uploadDocumentApi;

