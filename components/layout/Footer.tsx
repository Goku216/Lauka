
import { Leaf, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { getCategories } from '@/service/categoryApi';
import { CategoryResponse } from '@/service/productApi';


export function Footer() {
  const {isAuthenticated, isAdmin} = useAuth()
  const { config, loading: siteConfigLoading, error } = useSiteConfig();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    getCategories()
      .then(({ categories }) => setCategories(categories))
      .catch(() => {});
  }, []);


  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter */}
      {/* <div className="bg-primary py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-primary-foreground">Subscribe to Our Newsletter</h3>
              <p className="text-primary-foreground/80">Get updates on fresh arrivals and exclusive offers</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Enter your email"
                className="bg-primary-foreground text-foreground border-none rounded-full max-w-xs"
              />
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-2 rounded-full">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">{config?.site_name || "Leukaa"}</span>
            </div>
            <p className="text-background/70 mb-4">
              {config?.short_description || "Your trusted online store for everything you need, delivered right to your doorstep."}
            </p>
            <div className="flex gap-4">
              <a href={config?.facebook} className="text-background/70 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={config?.instagram} className="text-background/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={config?.twitter} className="text-background/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-background/70 hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/products" className="text-background/70 hover:text-primary transition-colors">All Products</Link>
              </li>
              <li>
                <Link href="/about" className="text-background/70 hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-background/70 hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.length === 0 ? (
                <li>
                  <Link href="/products" className="text-background/70 hover:text-primary transition-colors">All Products</Link>
                </li>
              ) : (
                categories.slice(0, 5).map((category) => (
                  <li key={category.reference_id}>
                    <Link
                      href={`/products?category=${category.reference_id}`}
                      className="text-background/70 hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/70">{config?.full_address || "Butwal, Rupandehi, Lumbini Province, Nepal"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-background/70">{config?.phone_number || "+977 9857083725"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-background/70">{config?.email || "leukaa2026@gmail.com"}</span>
              </li>
            </ul>
            {config?.cash_on_delivery && (
              <div className="mt-4 p-3 bg-background/10 rounded-lg">
                <p className="text-sm font-medium text-background/90">
                  💰 Cash on Delivery Only
                </p>
              </div>
            )}
          </div>
        </div>
      </div>


    {(isAuthenticated && isAdmin) && 
    <Link href="/admin">
    <div className='w-fit bg-primary ml-4 mb-2'>
        <Button variant="default" size="lg" className='rounded'>
          Admin Panel
        </Button>
      </div>
      </Link>

    }
      

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/60 text-sm">
              © 2024 {config?.site_name || "Leukaa"}. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/delivery" className="text-background/60 hover:text-primary transition-colors">
                Delivery Policy
              </Link>
              <Link href="/privacy" className="text-background/60 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
