import { apiService } from "../apiService";
import { baseModule } from "../../enum/api/basemodules.enum";
import { UserUrls } from "../../enum/api/user.enum";
import { ProfileResponse } from "../../features/common/types/commonTypes";

export const profileApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: `${baseModule.common}${UserUrls.LOAD_PROFILE}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetProfileQuery, useLazyGetProfileQuery } = profileApi;


