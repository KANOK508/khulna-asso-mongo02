"use client";

import { useSession as useBetterAuthSession } from "@/lib/auth-client";
import type { User } from "@/lib/auth";

export function useSession() {
  const { data, isPending, error } = useBetterAuthSession();

  const user = data?.user as User | undefined;
  const isAuthenticated = !!user;
  const isAdmin =
    user?.role === "superadmin" ||
    user?.role === "dept_admin" ||
    user?.role === "batch_admin";
  const isSuperAdmin = user?.role === "superadmin";

  return {
    user,
    isAuthenticated,
    isLoading: isPending,
    isAdmin,
    isSuperAdmin,
    error,
  };
}
