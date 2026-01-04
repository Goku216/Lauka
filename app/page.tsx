
import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/Hero';

import { TrustBadges } from '@/components/TrustBadges';
import { DeliveryBanner } from '@/components/DeliveryBanner';
import { Button } from '@/components/ui/button';
import { ArrowRight, Timer } from 'lucide-react';

import Link from 'next/link';
import CategoriesSection from '@/components/Landing/CategoriesSection';

const page = () => {
  // const featuredProducts = getFeaturedProducts();

  return (
    <Layout>
      {/* Hero Section */}
      <Hero />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="section-title">Top Saver Today</h2>
              <p className="text-muted-foreground mt-2">Fresh deals on organic produce</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div> */}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-8">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-fresh-light to-accent p-8">
              <div className="relative z-10">
                <span className="text-sm font-medium text-primary">FRESH FRUITS</span>
                <h3 className="text-2xl font-bold text-foreground mt-2">Fresh Fruits</h3>
                <p className="text-3xl font-bold text-primary mt-1">30% OFF</p>
                <Link href="/products?category=fruits">
                  <Button className="mt-4 btn-primary">Shop Now</Button>
                </Link>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&h=200&fit=crop" 
                alt="Fresh fruits" 
                className="absolute right-4 bottom-4 w-32 h-32 object-cover rounded-full"
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-lemon-light to-secondary/20 p-8">
              <div className="relative z-10">
                <span className="text-sm font-medium text-secondary-foreground">LEMON PLANTS</span>
                <h3 className="text-2xl font-bold text-foreground mt-2">Lemon Tree Saplings</h3>
                <p className="text-3xl font-bold text-primary mt-1">From रू 450</p>
                <Link href="/products?category=lemon-plants">
                  <Button className="mt-4 btn-primary">Shop Now</Button>
                </Link>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop" 
                alt="Lemon plants" 
                className="absolute right-4 bottom-4 w-32 h-32 object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Browse by Category</h2>
              <p className="text-muted-foreground mt-2">Find what you need quickly</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <CategoriesSection />
        </div>
      </section>

      {/* More Products */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">More Fresh Products</h2>
              <p className="text-muted-foreground mt-2">Explore our organic collection</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(4, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div> */}
        </div>
      </section>

      {/* Delivery Banner */}
      <DeliveryBanner />
    </Layout>
  );
};

export default page;
