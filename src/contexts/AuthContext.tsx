
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  signIn: (email: string, password: string) => Promise<boolean>; // Updated return type to boolean
  signOut: () => Promise<void>;
  isAuthorized: (allowedRoles: UserRole[]) => boolean;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to clean up auth state - prevents auth limbo issues
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state and set up listeners
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          setSupabaseUser(currentSession.user);
          
          // Defer data fetching to prevent Supabase auth deadlocks
          setTimeout(async () => {
            try {
              // Fetch user profile data
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
                
              if (profileError) {
                console.error('Error fetching profile:', profileError);
                return;
              }
              
              if (profileData) {
                setUser({
                  id: currentSession.user.id,
                  email: currentSession.user.email || '',
                  firstName: profileData.first_name || '',
                  lastName: profileData.last_name || '',
                  role: profileData.role as UserRole || 'cashier'
                });
              }
            } catch (error) {
              console.error('Error in auth state change:', error);
            }
          }, 0);
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        
        // Set loading to false after auth state is initialized
        setLoading(false);
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        setSupabaseUser(currentSession.user);
        
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data: profileData, error: profileError }) => {
            if (profileError) {
              console.error('Error fetching profile:', profileError);
              return;
            }
            
            if (profileData) {
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                firstName: profileData.first_name || '',
                lastName: profileData.last_name || '',
                role: profileData.role as UserRole || 'cashier'
              });
            }
            
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function with Supabase
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Clean up existing state and attempt global sign out first
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success(`Welcome back, ${data.user.email}`);
        
        // Fetch user profile immediately after login to ensure data is available
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (!profileError && profileData) {
            setUser({
              id: data.user.id,
              email: data.user.email || '',
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              role: profileData.role as UserRole || 'cashier'
            });
          }
        } catch (profileErr) {
          console.error('Error fetching profile after login:', profileErr);
        }
        
        return true; // Return success to indicate login was successful
      }
      return false; // Return false if no user data
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function with Supabase
  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      setUser(null);
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
