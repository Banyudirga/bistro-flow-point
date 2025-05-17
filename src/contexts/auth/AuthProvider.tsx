
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { AuthContext } from './AuthContext';
import { User, UserRole } from './types';
import { localStorageHelper, LocalStorageUser } from '@/utils/localStorage';
import { cleanupAuthState } from './utils';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    console.log("Initializing auth state from localStorage");
    
    // Set a short timeout to ensure this runs after any other initialization code
    const timer = setTimeout(() => {
      const storedUser = localStorageHelper.getUser();
      
      if (storedUser) {
        console.log("Found user in localStorage:", storedUser.email);
        setUser({
          id: storedUser.id,
          email: storedUser.email,
          firstName: storedUser.firstName,
          lastName: storedUser.lastName,
          role: storedUser.role
        });
      } else {
        console.log("No user found in localStorage");
        setUser(null);
      }
      
      setLoading(false);
      setInitialized(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);

  // Sign in function with localStorage
  const signIn = async (email: string, password: string): Promise<boolean> => {
    console.log("Attempting sign in for:", email);
    setLoading(true);
    
    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Demo accounts (hardcoded for now)
      const demoAccounts = [
        { email: 'owner@example.com', password: 'password', firstName: 'John', lastName: 'Owner', role: 'owner' as UserRole },
        { email: 'warehouse@example.com', password: 'password', firstName: 'Jane', lastName: 'Warehouse', role: 'warehouse_admin' as UserRole },
        { email: 'cashier@example.com', password: 'password', firstName: 'Bob', lastName: 'Cashier', role: 'cashier' as UserRole }
      ];
      
      const matchedAccount = demoAccounts.find(account => account.email === email && account.password === password);
      
      if (matchedAccount) {
        // Create user object
        const newUser: LocalStorageUser = {
          id: `user-${Date.now()}`, // Generate a simple ID
          email: matchedAccount.email,
          firstName: matchedAccount.firstName,
          lastName: matchedAccount.lastName,
          role: matchedAccount.role
        };
        
        // Store in localStorage
        localStorageHelper.setUser(newUser);
        
        // Update state
        setUser(newUser);
        console.log("Sign in successful for:", newUser.email);
        toast.success(`Welcome back, ${newUser.firstName}`);
        
        setLoading(false);
        setInitialized(true);
        return true;
      } else {
        console.error('Invalid credentials');
        setLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  // Sign out function with localStorage
  const signOut = async () => {
    console.log("Signing out");
    try {
      // First set user to null to prevent redirect loops during cleanup
      setUser(null);
      
      // Then clean up localStorage
      cleanupAuthState();
      
      toast.success('Logged out successfully');
    } catch (error: any) {
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
    <AuthContext.Provider value={{ user, loading, initialized, signIn, signOut, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};
