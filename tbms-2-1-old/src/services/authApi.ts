import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrls } from "../enum/api/baseurls.enum";
import{baseModule}  from  "../enum/api/basemodules.enum";
import { ApiLogin } from "../enum/api/auth.enum";

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

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrls.BASE_URL }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: baseModule.common + ApiLogin.LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = authApi;
