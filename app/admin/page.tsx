"use client";
import { Features } from "@/components/Admin/Landing/Features";
import { Footer } from "@/components/Admin/Landing/Footer";
import { Hero } from "@/components/Admin/Landing/Hero";
import { Navbar } from "@/components/Admin/Landing/Navbar";
import { AuthModals } from "@/components/Admin/modals/AuthModals";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Landing() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, isAdmin]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
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
