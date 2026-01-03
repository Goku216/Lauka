"use client";

import { useAuth } from "@/lib/auth-context";

export default function Protected({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return null;


  return children;
}
