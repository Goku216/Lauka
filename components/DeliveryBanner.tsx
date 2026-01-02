import { MapPin, Truck } from 'lucide-react';

export function DeliveryBanner() {
  return (
    <div className="bg-linear-to-r from-primary to-leaf text-primary-foreground py-4">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">Delivery available only in Lumbini Province</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-primary-foreground/50 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            <span className="font-medium">Cash on Delivery Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
    