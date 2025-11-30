import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponseDto, UserDto } from "../../lib/api/apiSlice";

export interface AuthState {
  user?: UserDto;
  token?: string;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: undefined,
  token: undefined,
  isAuthenticated: false,
   isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponseDto>) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = !!token;
      state.isHydrated = true;
    },
    logout(state) {
      state.user = undefined;
      state.token = undefined;
      state.isAuthenticated = false;
      state.isHydrated = true;
    },
    setHydrated(state) {
      state.isHydrated = true;
    },
  },
});

export const { setCredentials, logout, setHydrated } = authSlice.actions;
export default authSlice.reducer;
