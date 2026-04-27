"use client";

import { getSiteConfiguration } from "@/service/api";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// ==============================
// Types
// ==============================

export interface SiteConfig {
  reference_id: string;
  site_name: string;
  logo: string | null;
  phone_number: string;
  email: string;
  full_address: string;
  delivery_area: string;
  cash_on_delivery: boolean;
  happy_customers: number;
  fresh_products: number;
  organic_percentage: number;
  short_description: string;
  facebook: string;
  instagram: string;
  twitter: string;
  opening_time: string;
}

interface SiteConfigContextType {
  config: SiteConfig | null;
  loading: boolean;
  error: string | null;
  setConfig: (data: SiteConfig) => void;
  refreshConfig: () => Promise<void>;
}

// ==============================
// Context
// ==============================

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(
  undefined
);

// ==============================
// Provider
// ==============================

export const SiteConfigProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getSiteConfiguration(); // change endpoint

      setConfig(res as any);
      console.log("Site configuration loaded:", config);
    } catch (err: any) {
      setError(err.message || "Failed to load config");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        loading,
        error,
        setConfig,
        refreshConfig: fetchConfig,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

// ==============================
// Custom Hook
// ==============================

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);

  if (!context) {
    throw new Error(
      "useSiteConfig must be used inside SiteConfigProvider"
    );
  }

  return context;
};