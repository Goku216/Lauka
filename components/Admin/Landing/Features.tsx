import React from 'react';
import { 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  Bell, 
  Lock,
  Layers,
  Globe
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'User Management',
    description: 'Complete user lifecycle management with roles, permissions, and activity tracking.',
  },
  {
    icon: Package,
    title: 'Product Catalog',
    description: 'Organize and manage your products with categories, inventory, and pricing.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Gain insights with interactive charts, reports, and real-time metrics.',
  },
  {
    icon: Settings,
    title: 'Easy Configuration',
    description: 'Customize every aspect of your dashboard to match your workflow.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Stay informed with customizable alerts and notification preferences.',
  },
  {
    icon: Lock,
    title: 'Security First',
    description: 'Enterprise-grade security with audit logs and access controls.',
  },
  {
    icon: Layers,
    title: 'Modular Design',
    description: 'Extend functionality with a plugin-ready modular architecture.',
  },
  {
    icon: Globe,
    title: 'Global Ready',
    description: 'Multi-language support and timezone-aware data handling.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-[#F1F5F9]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive suite of tools designed to help you manage your business efficiently.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
