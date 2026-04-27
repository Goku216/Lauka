"use client"

import React from "react";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/lib/auth-context";
import { SiteConfigProvider } from "@/context/SiteConfigContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SiteConfigProvider>
      <CartProvider>{children}</CartProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
}
