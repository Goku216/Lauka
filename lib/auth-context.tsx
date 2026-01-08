"use client";

import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { checkAuth, logout } from "@/service/api";
import { toast } from "sonner";

type AuthContextType = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  logoutUser: () => Promise<void>;
  setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthentication = async () => {
    try {
      setLoading(true);

      const res = await checkAuth();

      setIsAuthenticated(res.isAuthenticated);
      setIsAdmin(res.role === "admin");
    } catch (error) {
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const logoutUser = async () => {
    try {
      await logout();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isAdmin,
        loading,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
