
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { cleanupAuthState } from '@/contexts/auth/utils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { user, loading, initialized, signIn } = useAuth();
  const navigate = useNavigate();
  
  // Clean up auth state when the login page is loaded
  // This helps prevent redirect loops due to stale auth state
  useEffect(() => {
    console.log("Login page mounted, cleaning up any stale auth state");
    cleanupAuthState();
  }, []);
  
  // If already logged in (and auth is fully initialized), redirect to main page
  useEffect(() => {
    if (initialized && user) {
      console.log("User is already logged in, redirecting to /pos");
      navigate('/pos', { replace: true });
    }
  }, [user, initialized, navigate]);
  
  // If auth is still loading, don't show redirects or login form yet
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <p>Loading authentication status...</p>
      </div>
    );
  }
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Please enter your first and last name');
      return;
    }
    
    setIsLoading(true);
    try {
      // For now, just display a message since we're not implementing sign up
      toast.info('Sign up is not available with local storage demo. Please use demo accounts.');
      setIsSignUp(false);
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      handleSignUp(e);
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await signIn(email, password);
      
      if (success) {
        console.log("Login successful, redirecting to /pos");
        // Use React Router navigate instead of window.location for better state management
        navigate('/pos', { replace: true });
      } else {
        setIsLoading(false);
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };
  
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Restaurant POS</CardTitle>
          <CardDescription className="text-center">
            {isSignUp ? 'Create an account to get started' : 'Sign in to your account to continue'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {!isSignUp && (
              <div className="text-sm text-muted-foreground">
                <p>Demo accounts:</p>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>owner@example.com / password</li>
                  <li>warehouse@example.com / password</li>
                  <li>cashier@example.com / password</li>
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Sign up" : "Sign in")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={toggleMode}
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
