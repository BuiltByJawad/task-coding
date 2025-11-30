"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/lib/store/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    if (!token && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    setChecked(true);
  }, [isAuthenticated, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/90">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
