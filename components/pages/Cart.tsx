"use client";

import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, MapPin, X } from 'lucide-react';
import Link from 'next/link';
import { LoginForm } from '../login-form';
import { useState, useEffect } from 'react';
import { SignupForm } from '../signup-form';
import { checkAuth } from '@/service/api';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const [modal, setModal] = useState<'none' | 'login' | 'signup'>('none');
  const {isAuthenticated} = useAuth()
  const router = useRouter();

  // Move all hooks before any conditional returns
  useEffect(() => {
    if (modal !== 'none') document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal('none');
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', onKey);
    };
  }, [modal]);

  const handleCheckout = () => {
    if (isAuthenticated) {
      // Redirect to checkout page
     console.log(isAuthenticated)
     router.replace("/checkout")
    } else {
      setModal("login");
    }
  };

  const handleIncrease = (referenceId: string, currentQty: number, stock: number) => {
  if (currentQty >= stock) {
    toast.error('No more stock available');
    return;
  }
  updateQuantity(referenceId, currentQty + 1);
};

const handleDecrease = (referenceId: string, currentQty: number) => {
  updateQuantity(referenceId, currentQty - 1);
};




  // Now check for empty cart after all hooks are called
  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-custom py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any products yet. Start shopping to fill your cart with fresh organic goodness!
            </p>
            <Link href="/products">
              <Button className="btn-primary">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          {" / "}
          <span className="text-foreground">Cart</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8">
          Shopping Cart ({totalItems} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items?.map((item) => (
              <div
                key={item.product.reference_id}
                className="bg-card p-4 sm:p-6 rounded-2xl shadow-card flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                <Link
                  href={`/product/${item.product.reference_id}`}
                  className="shrink-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full sm:w-24 h-24 object-cover rounded-xl"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.reference_id}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {item.product.unit}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-primary">
                      रू {item.product.price}
                    </span>
                    {item.product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        रू {item.product.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleDecrease(item.product.reference_id, item.quantity)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleIncrease(
                          item.product.reference_id,
                          item.quantity,
                          item.product.stock
                        )
                      }
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">
                      रू {Number(item.product.price) * item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.product.reference_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-2xl shadow-card sticky top-28">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>रू {totalPrice}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-primary">Free</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">रू {totalPrice}</span>
                </div>
              </div>

              {/* Delivery Notice */}
              <div className="bg-accent p-4 rounded-xl mb-6">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-accent-foreground">
                    Delivery available only within{" "}
                    <strong>Lumbini Province</strong>. Cash on Delivery only.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full btn-primary text-lg"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Link href="/products">
                <Button variant="ghost" className="w-full mt-3">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {modal !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setModal("none")}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md mx-4"
          >
            <div className="p-2">
              {modal === "login" ? (
                <LoginForm onLoginSuccess={() => setModal("none")} onSwitch={() => setModal("signup")} />
              ) : (
                <SignupForm onSwitch={() => setModal("login")} />
              )}
            </div>

            <button
              aria-label="Close modal"
              onClick={() => setModal("none")}
              className="absolute -top-2 -right-2 p-2 rounded-full bg-card shadow-md hover:opacity-90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}