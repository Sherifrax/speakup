import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrls } from "../enum/api/baseurls.enum";

// Function to get the token (modify as per your auth logic)
const getToken = () => localStorage.getItem("token") || "";
// const getAD = () => localStorage.getItem("AD") || "";

// Create a base API service with token authentication
export const apiService = createApi({
  reducerPath: "apiService",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrls.BASE_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        // headers.set("AD", getAD());
      }
      return headers;
    },
  }),
  endpoints: () => ({}), // Empty endpoints, as specific services will extend this
});
