"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/service/api";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  const checkAuthentiation = async () => {
    try {
      const res = await checkAuth();
      
      if(res) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

    } catch(error: any) {
   
      setIsAuthenticated(false);
   
    }
  };

  useEffect(() => {
    checkAuthentiation();
    const interval = setInterval(checkAuthentiation, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
