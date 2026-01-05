"use client";

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/context/CartContext';
import { LUMBINI_DISTRICTS, CheckoutForm } from '@/types';
import { MapPin, Truck, ShoppingBag, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Protected from '../Protected';
import { toast } from 'sonner';
import { bulkAddToCart, cartPayload, createOrder, OrderPayload } from '@/service/OrderApi';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    city: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/');
    }
    console.log("Check auth", isAuthenticated)
  }, [isAuthenticated, router]);


   const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    };

  if (items.length === 0 && !orderPlaced) {
    return (
      <Layout>
        <div className="container-custom py-16 text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
          <Link href="/products">
            <Button className="btn-primary">Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (orderPlaced) {
    return (
      <Layout>
        <div className="container-custom py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-muted-foreground mb-2">
              Thank you for your order. Your order number is:
            </p>
            <p className="text-2xl font-bold text-primary mb-6">{orderNumber}</p>
            <div className="bg-accent p-6 rounded-2xl text-left mb-8">
              <h3 className="font-semibold mb-4">What's Next?</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Our team will call you to confirm your order shortly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Your order will be delivered within Lumbini Province only.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Payment: Cash on Delivery. Pay when you receive your order.</span>
                </li>
              </ul>
            </div>
            <Link href="/">
              <Button className="btn-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.district) newErrors.district = 'Please select a district';
    if (!form.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Some required fields are missing or invalid.',);
      return;
    }

    try {

    setIsSubmitting(true);

     
    const cartPayload: cartPayload[] = items.map(item => ({
      product_reference_id: item.product.reference_id,
      quantity: item.quantity
    }))
    
    const cartResponse = await bulkAddToCart(cartPayload)


    const orderPayload: OrderPayload = {
      full_name: form.fullName,
      city: form.city,
      district: form.district,
      phone_number: form.phone,
      shipping_address: form.address,
      email: form.email,
      order_notes: form.notes
    }

    const orderResponse = await createOrder(orderPayload)

    setOrderNumber(orderResponse.data.order_code);
    clearCart();
    setOrderPlaced(true);

    toast.success(orderResponse.message);
    scrollToTop();
  
  } catch(error: any){
    toast.error(error.message)
  } finally {
      setIsSubmitting(false);
  }
  };

  const updateForm = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Protected>
    <Layout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          {' / '}
          <Link href="/cart" className="hover:text-primary">Cart</Link>
          {' / '}
          <span className="text-foreground">Checkout</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Notice */}
              <div className="bg-accent p-4 rounded-xl flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-accent-foreground">Delivery Area Notice</p>
                  <p className="text-sm text-muted-foreground">
                    We currently deliver only within Lumbini Province. Please ensure your address is within our delivery area.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-card p-6 rounded-2xl shadow-card">
                <h2 className="font-bold text-lg mb-4">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => updateForm('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className={errors.fullName ? 'border-destructive' : ''}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      placeholder="98XXXXXXXX"
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      placeholder="your@email.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card p-6 rounded-2xl shadow-card">
                <h2 className="font-bold text-lg mb-4">Delivery Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district">District (Lumbini Province) *</Label>
                    <Select
                      value={form.district}
                      onValueChange={(value) => updateForm('district', value)}
                    >
                      <SelectTrigger className={errors.district ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {LUMBINI_DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.district && (
                      <p className="text-sm text-destructive">{errors.district}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City / Municipality *</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                      placeholder="e.g., Butwal"
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      value={form.address}
                      onChange={(e) => updateForm('address', e.target.value)}
                      placeholder="Street, Ward No., Landmark"
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) => updateForm('notes', e.target.value)}
                      placeholder="Any special instructions for delivery"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card p-6 rounded-2xl shadow-card">
                <h2 className="font-bold text-lg mb-4">Payment Method</h2>
                <div className="bg-accent p-4 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-2xl shadow-card sticky top-28">
                <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.reference_id} className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-primary">
                          रू {Number(item.product.price) * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
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

                <Button
                  type="submit"
                  className="w-full btn-primary text-lg mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
    </Protected>
  );
}
