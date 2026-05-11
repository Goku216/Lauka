"use client";
import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/Hero";

import { TrustBadges } from "@/components/TrustBadges";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryResponse } from "@/service/productApi";
import { getCategories } from "@/service/categoryApi";
import { toast } from "sonner";
import { useSiteConfig } from "@/context/SiteConfigContext";

const page = () => {
  // const featuredProducts = getFeaturedProducts();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
   

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      const { categories } = await getCategories();

      setCategories(categories);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    const hasVisitedHome = sessionStorage.getItem("visited_home");

    if (!hasVisitedHome && isAuthenticated) {
      sessionStorage.setItem("visited_home", "true");
      router.replace("/products");
    }
  }, [loading, isAuthenticated]);

  return (
    <Layout>
      {/* Hero Section */}
      <Hero />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Featured Products */}
      {/* <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="section-title">Top Saver Today</h2>
              <p className="text-muted-foreground mt-2">
                Fresh deals on organic produce
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary/80"
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section> */}

      {/* Promotional Banner */}
      <section id="category" className="py-8">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Browse by Category</h2>
              <p className="text-muted-foreground mt-2">
                Find what you need quickly
              </p>
            </div>
            <Link href="/products">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {categoryLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {categories.map((category, index) => {
                // Alternate gradient backgrounds
                const gradients = [
                  "bg-gradient-to-r from-fresh-light to-accent",
                  "bg-gradient-to-r from-lemon-light to-secondary/20",
                  "bg-gradient-to-r from-blue-50 to-blue-100",
                  "bg-gradient-to-r from-purple-50 to-purple-100",
                  "bg-gradient-to-r from-orange-50 to-orange-100",
                  "bg-gradient-to-r from-pink-50 to-pink-100",
                ];

                const gradient = gradients[index % gradients.length];

                return (
                  <div
                    key={category.reference_id}
                    className={`relative overflow-hidden rounded-2xl ${gradient} p-8`}
                  >
                    <div className="relative z-10">
                      <span className="text-sm font-medium text-primary uppercase tracking-wide">
                        {category.name}
                      </span>
                      <h3 className="text-2xl font-bold text-foreground mt-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.product_count > 0
                          ? `${category.product_count} Products Available`
                          : "Coming Soon"}
                      </p>
                      <Link
                        href={`/products?category=${category.reference_id}`}
                      >
                        <Button className="mt-4 btn-primary">Shop Now</Button>
                      </Link>
                    </div>
                    <img
                      src={category.logo}
                      alt={category.name}
                      className="absolute right-4 bottom-4 w-32 h-32 object-cover rounded-full bg-white/50"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* More Products */}
      {/* <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">More Fresh Products</h2>
              <p className="text-muted-foreground mt-2">
                Explore our organic collection
              </p>
            </div>
            <Link href="/products">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(4, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div> 
        </div>
      </section> */}

      {/* Delivery Banner */}
      <DeliveryBanner />
    </Layout>
  );
};

export default page;
