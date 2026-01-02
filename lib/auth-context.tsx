'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/AdminPageTypes';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin user for demo purposes
const mockAdminUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  status: 'active',
  createdAt: '2024-01-01',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('auth_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    if (email && password.length >= 6) {
      const loggedInUser = { ...mockAdminUser, email };
      setUser(loggedInUser);
      localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock signup - in production, this would call an API
    if (name && email && password.length >= 6) {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
