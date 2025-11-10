import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiBaseName } from "../enum/api/ApiBaseName.enum";
import { ApiLogin } from "../enum/api/ApiLogin.enum";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  username: string;
  email: string;
  token_type: string;
  access_token: string;
  issued_on: string;
  expires_on: string;
}

interface UserInfoResponse {
  username: string;
  message: string;
  timestamp: string;
  authenticated: boolean;
}

interface LoadProfileRequest {
  moduleId: string;
}

interface LoadProfileResponse {
  // Add the actual response structure based on the API
  [key: string]: any;
}

// Function to get the token for authenticated requests
const getToken = () => localStorage.getItem("access_token") || "";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: ApiBaseName.COMMONS_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: ApiLogin.LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: ApiLogin.LOGOUT,
        method: "POST",
      }),
    }),
    getCurrentUser: builder.query<UserInfoResponse, void>({
      query: () => ({
        url: ApiLogin.ME,
        method: "GET",
      }),
    }),
    loadUserProfile: builder.query<LoadProfileResponse, LoadProfileRequest>({
      query: ({ moduleId }) => ({
        url: ApiLogin.LOAD_PROFILE,
        method: "GET",
        params: { moduleId },
      }),
    }),
  }),
});

export const { 
  useLoginUserMutation, 
  useLogoutUserMutation,
  useGetCurrentUserQuery,
  useLoadUserProfileQuery
} = authApi;
