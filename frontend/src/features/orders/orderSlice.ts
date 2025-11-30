import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { OrderDto } from "../../lib/api/apiSlice";

export interface OrderState {
  orders?: OrderDto[];
  lastCreatedOrder?: OrderDto;
}

const initialState: OrderState = {
  orders: undefined,
  lastCreatedOrder: undefined,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<OrderDto[] | undefined>) {
      state.orders = action.payload;
    },
    setLastCreatedOrder(state, action: PayloadAction<OrderDto | undefined>) {
      state.lastCreatedOrder = action.payload;
    },
  },
});

export const { setOrders, setLastCreatedOrder } = orderSlice.actions;
export default orderSlice.reducer;
