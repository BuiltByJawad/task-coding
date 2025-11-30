"use client";

import { useAppSelector } from "@/src/lib/store/hooks";

export function FullscreenLoader() {
  const isHydrated = useAppSelector((state) => state.auth.isHydrated);

  if (isHydrated) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}
