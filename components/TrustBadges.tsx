import { Truck, Shield, Leaf, Clock } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Same day delivery in Lumbini',
  },
  {
    icon: Clock,
    title: '24/7 Service',
    description: 'Order anytime, anywhere',
  },
  {
    icon: Shield,
    title: 'Verified Products',
    description: 'Quality guaranteed',
  },
  {
    icon: Leaf,
    title: '100% Fresh',
    description: 'Farm to doorstep freshness',
  },
];

export function TrustBadges() {
  return (
    <section className="py-12 bg-muted">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <badge.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{badge.title}</h3>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
