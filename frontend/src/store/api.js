import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl } from "../utils/urls.js";

const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Products", "Categories", "Orders", "Cart", "Wishlist", "Reviews", "User", "Dashboard"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({ url: "/products/", params }),
      providesTags: (result) => {
        const products = Array.isArray(result) ? result : result?.results || [];
        return products.length
          ? [...products.map((product) => ({ type: "Products", id: product.id })), "Products"]
          : ["Products"];
      }
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}/`,
      providesTags: (result, error, id) => [{ type: "Products", id }]
    }),
    getCategories: builder.query({
      query: () => "/categories/",
      providesTags: ["Categories"]
    }),
    getReviews: builder.query({
      query: (productId) => `/products/${productId}/reviews/`,
      providesTags: ["Reviews"]
    }),
    getCart: builder.query({
      query: () => "/cart/",
      providesTags: ["Cart"]
    }),
    getWishlist: builder.query({
      query: () => "/wishlist/",
      providesTags: ["Wishlist"]
    }),
    getOrders: builder.query({
      query: () => "/orders/",
      providesTags: ["Orders"]
    }),
    getOrderAnalytics: builder.query({
      query: () => "/orders/analytics/",
      providesTags: ["Orders"]
    }),
    getDashboardStats: builder.query({
      query: () => "/admin/dashboard/stats/",
      providesTags: ["Dashboard"]
    }),
    checkout: builder.mutation({
      query: (payload) => ({
        url: "/orders/checkout/",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Orders", "Cart", "Dashboard"]
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/orders/${id}/`,
        method: "PATCH",
        body: payload
      }),
      invalidatesTags: ["Orders", "Dashboard"]
    }),
    getAddresses: builder.query({
      query: () => "/addresses/",
      providesTags: ["User"]
    }),
    createAddress: builder.mutation({
      query: (payload) => ({
        url: "/addresses/",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["User"]
    }),
    getMe: builder.query({
      query: () => "/auth/me/",
      providesTags: ["User"]
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/token/",
        method: "POST",
        body: credentials
      })
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: "/auth/register/",
        method: "POST",
        body: payload
      })
    }),
    createProduct: builder.mutation({
      query: (payload) => ({
        url: "/products/",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Products", "Dashboard"]
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/products/${id}/`,
        method: "PATCH",
        body: payload
      }),
      invalidatesTags: ["Products", "Dashboard"]
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}/`,
        method: "DELETE"
      }),
      invalidatesTags: ["Products", "Dashboard"]
    }),
    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/categories/",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Categories", "Dashboard"]
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/categories/${id}/`,
        method: "PATCH",
        body: payload
      }),
      invalidatesTags: ["Categories", "Dashboard"]
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}/`,
        method: "DELETE"
      }),
      invalidatesTags: ["Categories", "Dashboard"]
    }),
    createProductImage: builder.mutation({
      query: (payload) => ({
        url: "/product-images/",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Products", "Dashboard"]
    }),
    deleteProductImage: builder.mutation({
      query: (id) => ({
        url: `/product-images/${id}/`,
        method: "DELETE"
      }),
      invalidatesTags: ["Products", "Dashboard"]
    }),
    uploadImage: builder.mutation({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/admin/uploads/image/",
          method: "POST",
          body: formData
        };
      }
    })
  })
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useGetReviewsQuery,
  useGetCartQuery,
  useGetWishlistQuery,
  useGetOrdersQuery,
  useGetOrderAnalyticsQuery,
  useGetDashboardStatsQuery,
  useCheckoutMutation,
  useUpdateOrderMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateProductImageMutation,
  useDeleteProductImageMutation,
  useUploadImageMutation
} = api;
