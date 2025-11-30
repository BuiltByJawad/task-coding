"use client";

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "./store";
import { AuthInitializer } from "@/src/features/auth/AuthInitializer";

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
