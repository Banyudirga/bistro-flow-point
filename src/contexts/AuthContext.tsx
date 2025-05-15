
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from "@/components/ui/sonner";

// Define user roles
export type UserRole = 'owner' | 'warehouse_admin' | 'cashier';

// Define user type
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthorized: (allowedRoles: UserRole[]) => boolean;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data (will be replaced with Supabase)
const MOCK_USERS = [
  {
    id: '1',
    email: 'owner@example.com',
    password: 'password',
    firstName: 'John',
    lastName: 'Owner',
    role: 'owner' as UserRole
  },
  {
    id: '2',
    email: 'warehouse@example.com',
    password: 'password',
    firstName: 'Jane',
    lastName: 'Warehouse',
    role: 'warehouse_admin' as UserRole
  },
  {
    id: '3',
    email: 'cashier@example.com',
    password: 'password',
    firstName: 'Bob',
    lastName: 'Cashier',
    role: 'cashier' as UserRole
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('pos_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('pos_user');
      }
    }
    setLoading(false);
  }, []);

  // Sign in function (will be replaced with Supabase auth)
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // In a real app, this would be a call to Supabase auth
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!mockUser) {
        throw new Error('Invalid login credentials');
      }
      
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      localStorage.setItem('pos_user', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${userWithoutPassword.firstName}`);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      localStorage.removeItem('pos_user');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
      throw error;
    }
  };

  // Check if user has permission based on role
  const isAuthorized = (allowedRoles: UserRole[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
