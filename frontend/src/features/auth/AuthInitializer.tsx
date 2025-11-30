"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/src/lib/store/hooks";
import { setCredentials, setHydrated } from "@/src/features/auth/authSlice";

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        dispatch(setCredentials({ user, token }));
      } catch {
        // ignore parse errors
      }
    }

    dispatch(setHydrated());
  }, [dispatch]);

  return null;
}
