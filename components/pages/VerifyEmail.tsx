"use client";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

useEffect(() => {
    if (status !== "success") {
    router.replace("/");
  }

}, [status, router])

if (status !== "success") return null;
  
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-fresh-green-light p-4">
      <Card className="w-full max-w-md shadow-card-hover animate-scale-in">
        <CardContent className="pt-8 pb-8 px-6 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-fresh-green/10 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-fresh-green" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-2 font-nunito">
            Email Verified!
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-8">
            Your email address has been successfully verified. You can now
            access all features of your account.
          </p>

          {/* Home Button */}
          <Link href="/">
            <Button className="w-full bg-fresh-green hover:bg-fresh-green/90 text-primary-foreground font-semibold">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
