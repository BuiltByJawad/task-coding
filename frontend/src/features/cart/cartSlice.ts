import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItemDto } from "../../lib/api/apiSlice";

export interface CartState {
  items?: CartItemDto[];
}

const initialState: CartState = {
  items: undefined,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItemDto[] | undefined>) {
      state.items = action.payload;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
