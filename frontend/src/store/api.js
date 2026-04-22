import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
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
  tagTypes: ["Products", "Categories", "Orders", "Cart", "Wishlist", "Reviews", "User"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({ url: "/products/", params }),
      providesTags: (result) =>
        result
          ? [...result.map((product) => ({ type: "Products", id: product.id })), "Products"]
          : ["Products"]
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
    checkout: builder.mutation({
      query: (payload) => ({
        url: "/orders/checkout/",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Orders", "Cart"]
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/orders/${id}/`,
        method: "PATCH",
        body: payload
      }),
      invalidatesTags: ["Orders"]
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
      invalidatesTags: ["Products"]
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/products/${id}/`,
        method: "PATCH",
        body: payload
      }),
      invalidatesTags: ["Products"]
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}/`,
        method: "DELETE"
      }),
      invalidatesTags: ["Products"]
    }),
    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/categories/",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Categories"]
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/categories/${id}/`,
        method: "PATCH",
        body: payload
      }),
      invalidatesTags: ["Categories"]
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}/`,
        method: "DELETE"
      }),
      invalidatesTags: ["Categories"]
    }),
    createProductImage: builder.mutation({
      query: (payload) => ({
        url: "/product-images/",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Products"]
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
  useCreateProductImageMutation
} = api;
