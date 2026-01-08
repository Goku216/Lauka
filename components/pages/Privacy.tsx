import { Layout } from '@/components/layout/Layout';
import { Shield, Eye, Lock, Users, FileText } from 'lucide-react';

export default function Privacy() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-linear-to-br from-fresh-light to-accent py-16">
        <div className="container-custom text-center">
          <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, 
            use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div className="bg-card p-8 rounded-2xl shadow-card mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold m-0">Information We Collect</h2>
              </div>
              <p className="text-muted-foreground">
                When you place an order with Leukaa, we collect the following information:
              </p>
              <ul className="text-muted-foreground mt-4 space-y-2">
                <li>• Full name and contact details (phone number, email)</li>
                <li>• Delivery address within Lumbini Province</li>
                <li>• Order history and preferences</li>
                <li>• Communication records with our customer service</li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold m-0">How We Use Your Information</h2>
              </div>
              <p className="text-muted-foreground">We use your information to:</p>
              <ul className="text-muted-foreground mt-4 space-y-2">
                <li>• Process and deliver your orders</li>
                <li>• Contact you regarding order confirmations and updates</li>
                <li>• Improve our products and services</li>
                <li>• Send promotional offers (with your consent)</li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold m-0">Data Protection</h2>
              </div>
              <p className="text-muted-foreground">
                We take appropriate measures to protect your personal information. 
                Your data is stored securely and is only accessible to authorized personnel. 
                We do not sell or share your personal information with third parties for 
                marketing purposes.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold m-0">Your Rights</h2>
              </div>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="text-muted-foreground mt-4 space-y-2">
                <li>• Access the personal information we hold about you</li>
                <li>• Request correction of inaccurate information</li>
                <li>• Request deletion of your personal data</li>
                <li>• Opt out of marketing communications</li>
              </ul>
            </div>

            <div className="bg-accent p-6 rounded-2xl">
              <h3 className="font-bold mb-2">Contact Us</h3>
              <p className="text-sm text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <strong>Email:</strong> info@leukaa.com
                <br />
                <strong>Phone:</strong> +977 98XXXXXXXX
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                <em>Last updated: December 2024</em>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
