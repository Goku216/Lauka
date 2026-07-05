"use client"
import { Layout } from '@/components/layout/Layout';

import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { Sparkles, Truck, Users, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const {config} = useSiteConfig()
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-linear-to-br from-fresh-light via-background to-lemon-light py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Your Trusted <span className="text-primary">Online</span> Shopping Destination
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                We are an online store dedicated to bringing you a wide range of quality
                products at great prices. Our mission is to make shopping simple, affordable,
                and convenient — delivered right to your doorstep.
              </p>
              <Link href="/products">
                <Button className="btn-primary">
                  Shop Our Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop"
                alt="Supermarket shelves stocked with groceries"
                className="rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Products</h3>
              <p className="text-muted-foreground">
                Every item is carefully selected to meet our high standards for
                quality and value, so you can shop with confidence.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-muted-foreground">
                We deliver your orders quickly and reliably, bringing everything
                you need right to your doorstep.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Customer First</h3>
              <p className="text-muted-foreground">
                Our customers are at the heart of everything we do. Your
                satisfaction is always our top priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&h=400&fit=crop"
                alt="Collection of fresh groceries on supermarket shelves"
                className="rounded-3xl shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="section-title mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {config?.site_name || "Leukaa"} started in 2020 with a simple idea: make quality
                  products accessible to everyone at prices they can afford. What began as a small
                  online store has grown into a trusted shopping destination for thousands of
                  customers.
                </p>
                <p>
                  We bring together a carefully curated selection of products across many
                  categories, so you can find everything you need in one place — all with the
                  convenience of shopping from home.
                </p>
                <p>
                  Today, we serve hundreds of happy customers, delivering their orders right to
                  their doorsteps. Cash on delivery makes it easy and accessible for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-accent">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="section-title mb-4">Proudly Serving Lumbini Province</h2>
            <p className="text-muted-foreground mb-8">
              We currently deliver to all districts within Lumbini Province including 
              Rupandehi, Kapilvastu, Palpa, Dang, Banke, and more. Same-day delivery 
              available in select areas.
            </p>
            <Link href="/delivery">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View Delivery Areas
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
