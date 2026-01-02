import { Layout } from '@/components/layout/Layout';
import { MapPin, Truck, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { LUMBINI_DISTRICTS } from '@/types';

export default function Delivery() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-linear-to-br from-fresh-light to-accent py-16">
        <div className="container-custom text-center">
          <Truck className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Delivery Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We deliver fresh organic products right to your doorstep within Lumbini Province. 
            Here's everything you need to know about our delivery service.
          </p>
        </div>
      </section>

      {/* Key Info */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card p-6 rounded-2xl shadow-card text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Delivery Area</h3>
              <p className="text-muted-foreground">Lumbini Province Only</p>
            </div>
            <div className="bg-card p-6 rounded-2xl shadow-card text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Delivery Time</h3>
              <p className="text-muted-foreground">1-3 Business Days</p>
            </div>
            <div className="bg-card p-6 rounded-2xl shadow-card text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Delivery Charge</h3>
              <p className="text-muted-foreground">FREE on all orders</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-2xl mb-12">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg text-foreground mb-2">Important Notice</h3>
                <p className="text-muted-foreground">
                  We currently deliver <strong>only within Lumbini Province</strong>. 
                  Orders from outside Lumbini Province cannot be processed. We are working 
                  to expand our delivery area and will update this page when new areas become available.
                </p>
              </div>
            </div>
          </div>

          {/* Serviceable Districts */}
          <div className="mb-12">
            <h2 className="section-title mb-6">Serviceable Districts</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {LUMBINI_DISTRICTS.map((district) => (
                <div key={district} className="flex items-center gap-2 bg-accent p-4 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="font-medium">{district}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card p-8 rounded-2xl shadow-card mb-12">
            <h2 className="section-title mb-6">Payment Method</h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-2xl">💵</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Cash on Delivery (COD)</h3>
                <p className="text-muted-foreground">
                  We accept <strong>Cash on Delivery only</strong>. No online payment options are available 
                  at this time. Please have the exact amount ready when your order arrives. Our delivery 
                  personnel will provide a receipt upon payment.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Process */}
          <div>
            <h2 className="section-title mb-6">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: 1, title: 'Place Order', desc: 'Browse products and add to cart' },
                { step: 2, title: 'Confirmation', desc: 'We call to confirm your order' },
                { step: 3, title: 'Preparation', desc: 'Fresh produce packed with care' },
                { step: 4, title: 'Delivery', desc: 'Pay cash when order arrives' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
