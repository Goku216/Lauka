"use client"

import { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X, MapPin, Phone, Search, Leaf, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { checkAuth, logout } from '@/service/api';
import { navigate } from 'next/dist/client/components/segment-cache/navigation';

interface HeaderProps {
  setModal: (value: 'none' | 'login' | 'signup') => void;
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Delivery', path: '/delivery' },
  { name: 'Contact', path: '/contact' },
];

export function Header({ setModal }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const response = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
    };
    response();
  }, []);

  const { totalItems } = useCart();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
    await logout();
    window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container-custom flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Delivery available only in Lumbini Province</span>
            <span className="sm:hidden">Lumbini Province Only</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>+977 98XXXXXXXX</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-full">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Lauka</h1>
              <p className="text-xs text-muted-foreground">Fresh from Farm</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-medium transition-colors hover:text-primary ${
                  pathname === link.path
                    ? 'text-primary'
                    : 'text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fresh products..."
                className="pl-10 bg-muted border-none rounded-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            {!isAuthenticated &&
            <>
            <Button className='hidden lg:block' onClick={()=> setModal('login')} variant="default">
                Login
            </Button>
            <Button className='hidden lg:block' onClick={()=> setModal('signup')} variant="outline">
                Signup
            </Button>
            </>
}
            {isAuthenticated &&
            <>
            <Button  variant="default" size="icon" className="text-center flex " onClick={() => setModal('none')}>
              <User className="h-5 w-5" />
            </Button>
            <Button onClick={handleLogout}  variant="ghost" size="icon" className="text-center flex hover:bg-red-400 hover:text-black">
              <LogOut className="h-5 w-5" />
            </Button>
            </>
}
           
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-70">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`font-medium text-lg transition-colors hover:text-primary ${
                        pathname === link.path
                          ? 'text-primary'
                          : 'text-foreground'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 p-4 bg-accent rounded-lg">
                  <p className="text-sm text-accent-foreground font-medium">
                    📍 Delivery available only within Lumbini Province
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fresh products..."
                className="pl-10 bg-muted border-none rounded-full"
              />
            </div>
          </div>
        )}
      </div>
     
    </header>
  );
}
