import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductUIState {
  selectedProductId?: string;
}

const initialState: ProductUIState = {
  selectedProductId: undefined,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProductId(state, action: PayloadAction<string | undefined>) {
      state.selectedProductId = action.payload;
    },
  },
});

export const { setSelectedProductId } = productSlice.actions;
export default productSlice.reducer;
