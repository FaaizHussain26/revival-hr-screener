"use client";

import { getCurrentUser, isAdmin } from "@/lib/auth";
import type { ReactNode } from "react";

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const user = getCurrentUser();

  if (!isAdmin(user)) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need admin privileges to access this feature.
          </p>
          {fallback}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
