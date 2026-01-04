"use client";
import { mockOrders } from "@/app/profile/page";
import { AdminLayout } from "@/components/Admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Truck,
  X,
} from "lucide-react";
import React, { useState } from "react";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "delivered":
      return {
        icon: CheckCircle,
        label: "Delivered",
        className: "bg-green-100 text-green-700",
      };
    case "shipped":
      return {
        icon: Truck,
        label: "Shipped",
        className: "bg-blue-100 text-blue-700",
      };
    case "processing":
      return {
        icon: Clock,
        label: "Processing",
        className: "bg-yellow-100 text-yellow-700",
      };
    default:
      return {
        icon: Package,
        label: status,
        className: "bg-muted text-muted-foreground",
      };
  }
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Orders</h2>
            <p className="text-muted-foreground">Manage your orders history</p>
          </div>
        </div>
        <Card className="shadow-card">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-semibold ">
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {mockOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-xl border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex flex-col gap-3 p-3 sm:p-4 ">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                          <Package className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <p className="font-semibold text-sm sm:text-base text-foreground">
                              {order.id}
                            </p>
                            <Badge
                              className={`${statusConfig.className} text-xs w-fit`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {order.items.length} items • Ordered on {order.date}
                          </p>
                          <p className="text-base sm:text-xl font-bold text-foreground mt-2">
                            रू{order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mr-4 ">
                      <p
                        className="text-primary/90  hover:underline hover:text-primary/80 flex gap-1 items-center cursor-pointer"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        View Details <ArrowRight className="w-4 h-4" />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 my-20  flex items-center justify-center pt-8">
           
            <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="sticky top-0 bg-card border-b border-border p-4 sm:p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    Order Details
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {selectedOrder.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowOrderModal(false)}
                  className="shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 sm:p-6">
                {/* Status */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Order Status
                    </p>
                    <Badge
                      className={`${
                        getStatusConfig(selectedOrder.status).className
                      } text-sm`}
                    >
                      {React.createElement(
                        getStatusConfig(selectedOrder.status).icon,
                        { className: "w-4 h-4 mr-1" }
                      )}
                      {getStatusConfig(selectedOrder.status).label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Order Date
                    </p>
                    <p className="font-semibold text-sm sm:text-base">
                      {selectedOrder.date}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm sm:text-base mb-3">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-card flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base text-foreground">
                            {item.name}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-sm sm:text-base text-foreground">
                          रू{item.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm sm:text-base mb-3">
                    Delivery Address
                  </h3>
                  <div className="p-3 sm:p-4 rounded-lg bg-muted/50">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs sm:text-sm text-foreground">
                        {selectedOrder.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm sm:text-base mb-3">
                    Payment Method
                  </h3>
                  <div className="p-3 sm:p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <p className="text-xs sm:text-sm text-foreground">
                        {selectedOrder.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base sm:text-lg font-semibold text-foreground">
                      Total Amount
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      रू{selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
