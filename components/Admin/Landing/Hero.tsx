
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero2" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#3B5BDB]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#3B5BDB]/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B5BDB]/10 text-[#3B5BDB] text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>Powerful Admin Dashboard</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] mb-6 animate-slide-up">
            Manage Everything
            <br />
            <span className="bg-linear-to-r from-[#3B5BDB] to-purple-500 bg-clip-text text-transparent">
              In One Place
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-[#64748B] max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            A modern, minimal admin dashboard built for scale. Manage users, products, 
            analytics, and more with an intuitive interface.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl" onClick={onGetStarted} className='cursor-pointer'>
              Get Started 
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground text-center">
                Track sales, users, and performance metrics in real-time
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Secure Access</h3>
              <p className="text-sm text-muted-foreground text-center">
                Role-based permissions and secure authentication
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground text-center">
                Optimized for speed with modern technologies
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
