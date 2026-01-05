
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Shield,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { statusColors } from '@/app/admin/orders/page';


interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}



const allStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="w-5 h-5 text-primary" />
            Order Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm text-muted-foreground">Order Code</p>
              <p className="font-semibold">{order.order_code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <Select
                value={order.status}
                onValueChange={(value: OrderStatus) =>
                  onStatusChange(order.order_id, value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue>
                    <Badge className={`${statusColors[order.status]} border-0`}>
                      {order.status}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {allStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      <Badge className={`${statusColors[status]} border-0`}>
                        {status}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold text-primary">Rs. {order.total_price}</p>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Customer Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{order.user.full_name || order.user.username}</span>
                  {order.user.is_verified && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{order.user.email}</span>
                </div>
                {order.user.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{order.user.phone_number}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Joined {formatDate(order.user.date_joined)}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  {order.user.is_active ? (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" /> Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-300">
                      <XCircle className="w-3 h-3 mr-1" /> Inactive
                    </Badge>
                  )}
                  {order.user.two_fa_enabled && (
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      <Shield className="w-3 h-3 mr-1" /> 2FA
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">{order.full_name}</p>
                  <p className="text-muted-foreground">{order.shipping_address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {order.city}, {order.district}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{order.phone_number}</span>
                </div>
                {order.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{order.email}</span>
                  </div>
                )}
                {order.order_notes && (
                  <div className="pt-2 p-3 rounded-md bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Order Notes</p>
                    <p>{order.order_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={item.reference_id}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Product ID: {item.product}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rs. {item.price}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    {index < order.items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs. {order.total_price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">Rs. {order.total_price}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
