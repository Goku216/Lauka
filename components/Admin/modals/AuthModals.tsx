import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AuthModalsProps {
  isLoginOpen: boolean;
  onLoginClose: () => void;
}

export function AuthModals({
  isLoginOpen,
  onLoginClose,

}: AuthModalsProps) {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(loginEmail, loginPassword);

    if (success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      onLoginClose();
      setLoginEmail('');
      setLoginPassword('');
    } else {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };


  return (
    <>
      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={onLoginClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Welcome back</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
           
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="focus-visible:border-[#3B5BDB] focus-visible:ring-[#3B5BDB] focus-visible:ring-[1px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="focus-visible:border-[#3B5BDB] focus-visible:ring-[#3B5BDB] focus-visible:ring-[1px]"
                required
              />
            </div>
            <Button variant="hero" type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          
          </form>
        </DialogContent>
      </Dialog>

    </>
  );
}
