"use client";

import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Layout handles showing login form
  }

  return <>{children}</>;
}
