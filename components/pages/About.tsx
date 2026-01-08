import { Layout } from '@/components/layout/Layout';

import { Button } from '@/components/ui/button';
import { Leaf, Heart, Users, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-linear-to-br from-fresh-light via-background to-lemon-light py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Fresh from the Heart of <span className="text-primary">Lumbini</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                We are a family-owned organic farm and market, dedicated to bringing the freshest 
                produce from local Lumbini farms directly to your table. Our mission is to promote 
                healthy eating while supporting local farmers.
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
                src="https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&h=400&fit=crop"
                alt="Organic farm in Lumbini"
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
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Organic</h3>
              <p className="text-muted-foreground">
                All our products are grown without pesticides or harmful chemicals. 
                We believe in natural farming methods that are good for you and the earth.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Farm Fresh</h3>
              <p className="text-muted-foreground">
                From harvest to your doorstep within hours. We ensure maximum freshness 
                by sourcing directly from local farms in Lumbini Province.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Supporting Local</h3>
              <p className="text-muted-foreground">
                We partner with over 50 local farmers in Lumbini Province, helping them 
                get fair prices for their produce while supporting the local economy.
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
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop"
                alt="Fresh organic vegetables"
                className="rounded-3xl shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="section-title mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Leukaa started in 2020 with a simple idea: make fresh, organic 
                  produce accessible to everyone in Lumbini Province. What began as a small 
                  family farm has grown into a community of farmers, all committed to organic 
                  and sustainable farming practices.
                </p>
                <p>
                  We specialize in citrus fruits, particularly lemons and lemon plants, which 
                  thrive in our region's climate. Our lemon trees are grown with care, and we 
                  also offer saplings for those who want to grow their own organic lemons at home.
                </p>
                <p>
                  Today, we serve hundreds of families across Lumbini Province, delivering fresh 
                  fruits, vegetables, and organic products right to their doorsteps. Cash on 
                  delivery makes it easy and accessible for everyone.
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
