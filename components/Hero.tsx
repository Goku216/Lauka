import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-fresh-light via-background to-lemon-light">
      <div className="container-custom py-8 md:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 animate-fade-in text-center md:text-start">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Leaf className="h-4 w-4" />
              100% Natural & Organic
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Fresh and Healthy{' '}
              <span className="text-primary">Organic</span>{' '}
              Products
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Discover the finest organic fruits, vegetables, and lemon plants from 
              local Lumbini farms. Delivered fresh to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button className="btn-primary text-lg px-10 py-7">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="text-lg px-10 py-7 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Fresh Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Organic</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=600&fit=crop"
              alt="Fresh organic fruits and vegetables in a basket"
              className="relative rounded-3xl shadow-2xl animate-bounce-gentle"
            />
            {/* Floating badges */}
            <div className="absolute -left-4 top-1/4 bg-card p-4 rounded-2xl shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-lemon rounded-full flex items-center justify-center">
                  🍋
                </div>
                <div>
                  <p className="font-bold text-foreground">Fresh Lemons</p>
                  <p className="text-sm text-muted-foreground">From रू 180/kg</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 bottom-1/4 bg-card p-4 rounded-2xl shadow-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-fresh-light rounded-full flex items-center justify-center">
                  🥬
                </div>
                <div>
                  <p className="font-bold text-foreground">Organic Veggies</p>
                  <p className="text-sm text-primary">30% OFF Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-lemon/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
    </section>
  );
}
