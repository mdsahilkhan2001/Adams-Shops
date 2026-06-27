import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearCredentials, setAuthError } from "./authSlice.js";
import { api } from "./api.js";
import { getAuthApiBaseUrl } from "../utils/urls.js";

const baseQuery = fetchBaseQuery({
  baseUrl: getAuthApiBaseUrl(),
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(
        setCredentials({
          token: refreshResult.data.accessToken,
          user: refreshResult.data.user
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
      api.dispatch(setAuthError("Session expired. Please log in again."));
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({ url: "/auth/login", method: "POST", body: payload })
    }),
    adminLogin: builder.mutation({
      query: (payload) => ({ url: "/admin/login", method: "POST", body: payload })
    }),
    register: builder.mutation({
      query: (payload) => ({ url: "/auth/register", method: "POST", body: payload }),
      async onQueryStarted(_payload, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(api.util.invalidateTags(["Dashboard"]));
        } catch {
          // Let the caller handle the error message.
        }
      }
    }),
    refreshToken: builder.query({
      query: () => ({ url: "/auth/refresh-token", method: "POST" }),
      providesTags: ["Auth"]
    }),
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" })
    }),
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"]
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({ url: "/auth/profile", method: "PUT", body: payload })
    }),
    forgotPassword: builder.mutation({
      query: (payload) => ({ url: "/auth/forgot-password", method: "POST", body: payload })
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({ url: "/auth/reset-password", method: "POST", body: payload })
    }),
    verifyEmail: builder.mutation({
      query: (payload) => ({ url: "/auth/verify-email", method: "POST", body: payload })
    }),
    resendVerification: builder.mutation({
      query: (payload) => ({ url: "/auth/resend-verification", method: "POST", body: payload })
    }),
    changePassword: builder.mutation({
      query: (payload) => ({ url: "/auth/change-password", method: "POST", body: payload })
    })
  })
});

export const {
  useLoginMutation,
  useAdminLoginMutation,
  useRegisterMutation,
  useLazyRefreshTokenQuery,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useChangePasswordMutation
} = authApi;
