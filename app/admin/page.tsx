"use client";
import { Features } from '@/components/Admin/Landing/Features';
import { Footer } from '@/components/Admin/Landing/Footer';
import { Hero } from '@/components/Admin/Landing/Hero';
import { Navbar } from '@/components/Admin/Landing/Navbar';
import { AuthModals } from '@/components/Admin/modals/AuthModals';
import { useState } from 'react';


export default function Landing() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        onSignupClick={() => setIsSignupOpen(true)}
      />
      <Hero onGetStarted={() => setIsSignupOpen(true)} />
      <Features />
      <Footer />
      
      <AuthModals
        isLoginOpen={isLoginOpen}
        isSignupOpen={isSignupOpen}
        onLoginClose={() => setIsLoginOpen(false)}
        onSignupClose={() => setIsSignupOpen(false)}
        onSwitchToSignup={handleSwitchToSignup}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}
