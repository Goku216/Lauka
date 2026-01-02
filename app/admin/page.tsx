"use client";
import { Features } from '@/components/Admin/Landing/Features';
import { Footer } from '@/components/Admin/Landing/Footer';
import { Hero } from '@/components/Admin/Landing/Hero';
import { Navbar } from '@/components/Admin/Landing/Navbar';
import { AuthModals } from '@/components/Admin/modals/AuthModals';
import { useState } from 'react';


export default function Landing() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);




  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
      />
      <Hero onGetStarted={() => setIsLoginOpen(true)} />
      <Features />
      <Footer />
      
      <AuthModals
        isLoginOpen={isLoginOpen}
        onLoginClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
