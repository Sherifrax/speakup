import { apiService } from "../apiService";
import{baseModule}  from  "../../enum/api/basemodules.enum";
import { CommonUrls } from "../../enum/api/common.enum";
import { ProfileResponse } from "../../features/common/types/commonTypes";

// Extend the base apiService
export const profileApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => {
        const moduleId = localStorage.getItem("ModuleName") || "SPU12345"; // ✅ dynamic from localStorage
        return {
          url: `${baseModule.common}${CommonUrls.ProfileGet}?moduleId=${moduleId}`,
          method: "GET",
        };
      },
    }),
  }),
  overrideExisting: false,
});

// ✅ Export both hooks
export const { useGetProfileQuery, useLazyGetProfileQuery } = profileApi;
