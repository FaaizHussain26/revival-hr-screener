"use client";

import { getCurrentUser, isAdmin } from "@/lib/auth";
import { useMemo } from "react";

export function useAdmin() {
  const user = getCurrentUser();

  return useMemo(
    () => ({
      user,
      isAdmin: isAdmin(user),
      canEdit: isAdmin(user),
      canDelete: isAdmin(user),
      canRestore: isAdmin(user),
    }),
    [user]
  );
}
