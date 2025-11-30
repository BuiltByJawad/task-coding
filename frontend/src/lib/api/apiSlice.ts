import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { axiosClient } from "./axiosClient";

export interface UserDto {
  id?: string;
  name?: string;
  email?: string;
}

export interface AuthResponseDto {
  user?: UserDto;
  token?: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface ProductDto {
  _id?: string;
  title?: string;
  price?: number;
  description?: string;
  image?: string;
}

export interface CartItemDto {
  _id?: string;
  product?: ProductDto;
  quantity?: number;
}

export interface CartResponseDto {
  cart?: CartItemDto[];
}

export interface OrderItemDto {
  product?: ProductDto;
  quantity?: number;
  priceAtOrder?: number;
}

export interface OrderDto {
  _id?: string;
  user?: string;
  items?: OrderItemDto[];
  totalPrice?: number;
  createdAt?: string;
}

interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
}

interface AxiosBaseQueryError {
  status?: number;
  data?: unknown;
}

const axiosBaseQuery = (): BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  AxiosBaseQueryError
> =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await axiosClient({ url, method, data, params });
      return { data: result.data };
    } catch (error) {
      const err = error as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Product", "Cart", "Order", "Auth"],
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponseDto, RegisterRequestDto>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<AuthResponseDto, LoginRequestDto>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Auth"],
    }),
    getProducts: builder.query<ProductDto[], void>({
      query: () => ({ url: "/products" }),
      providesTags: ["Product"],
    }),
    getProductById: builder.query<ProductDto, string>({
      query: (id) => ({ url: `/products/${id}` }),
      providesTags: ["Product"],
    }),
    getCart: builder.query<CartResponseDto, void>({
      query: () => ({ url: "/cart" }),
      providesTags: ["Cart"],
    }),
    addOrUpdateCart: builder.mutation<
      CartResponseDto,
      { productId: string; quantity: number }
    >({
      query: (body) => ({
        url: "/cart",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<CartResponseDto, string>({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    placeOrder: builder.mutation<OrderDto, void>({
      query: () => ({
        url: "/orders",
        method: "POST",
      }),
      invalidatesTags: ["Cart", "Order"],
    }),
    getOrders: builder.query<OrderDto[], void>({
      query: () => ({ url: "/orders" }),
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCartQuery,
  useAddOrUpdateCartMutation,
  useRemoveCartItemMutation,
  usePlaceOrderMutation,
  useGetOrdersQuery,
} = apiSlice;
