"use client";
import React, { useEffect, useState } from "react";

import {
  User,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Edit2,
  Plus,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  Home,
  Leaf,
  Menu,
  X,
  Phone,
  Mail,
  Calendar,
  Save,
  BadgeCheck,
  Ban,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { getOrders, OrderResponse } from "@/service/OrderApi";
import { ca } from "zod/v4/locales";
import { toast } from "sonner";

// Mock user data
const mockUser = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "",
  memberSince: "January 2024",
};

// Mock orders with detailed items
export const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "Dec 28, 2024",
    status: "delivered",
    total: 156.99,
    items: [
      {
        name: "Organic Tomatoes",
        quantity: 2,
        price: 24.99,
        image: "/placeholder.svg",
      },
      {
        name: "Fresh Lettuce",
        quantity: 1,
        price: 12.0,
        image: "/placeholder.svg",
      },
      {
        name: "Carrots (1kg)",
        quantity: 3,
        price: 45.0,
        image: "/placeholder.svg",
      },
      {
        name: "Organic Eggs",
        quantity: 2,
        price: 75.0,
        image: "/placeholder.svg",
      },
    ],
    deliveryAddress: "123 Fresh Street, Apt 4B, San Francisco, CA 94102",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "ORD-2024-002",
    date: "Dec 20, 2024",
    status: "shipped",
    total: 89.5,
    items: [
      {
        name: "Fresh Spinach",
        quantity: 2,
        price: 44.5,
        image: "/placeholder.svg",
      },
      {
        name: "Organic Bananas",
        quantity: 1,
        price: 45.0,
        image: "/placeholder.svg",
      },
    ],
    deliveryAddress: "456 Market Avenue, Suite 100, San Francisco, CA 94103",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "ORD-2024-003",
    date: "Dec 15, 2024",
    status: "processing",
    total: 234.0,
    items: [
      {
        name: "Mixed Vegetables",
        quantity: 4,
        price: 120.0,
        image: "/placeholder.svg",
      },
      {
        name: "Organic Potatoes",
        quantity: 2,
        price: 60.0,
        image: "/placeholder.svg",
      },
      {
        name: "Fresh Herbs Bundle",
        quantity: 3,
        price: 54.0,
        image: "/placeholder.svg",
      },
    ],
    deliveryAddress: "123 Fresh Street, Apt 4B, San Francisco, CA 94102",
    paymentMethod: "Cash on Delivery",
  },
];

// Mock addresses
export const mockAddresses = [
  {
    id: "1",
    type: "Home",
    name: "Sarah Johnson",
    address: "123 Fresh Street, Apt 4B",
    city: "San Francisco, CA 94102",
    isDefault: true,
  },
  {
    id: "2",
    type: "Work",
    name: "Sarah Johnson",
    address: "456 Market Avenue, Suite 100",
    city: "San Francisco, CA 94103",
    isDefault: false,
  },
];

// Mock wishlist
const mockWishlist = [
  {
    id: "1",
    name: "Organic Avocados (6 pack)",
    price: 12.99,
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Fresh Strawberries",
    price: 8.99,
    image: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Artisan Sourdough Bread",
    price: 6.5,
    image: "/placeholder.svg",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return {
        icon: CheckCircle,
        label: "Delivered",
        className: "bg-green-100 text-green-700",
      };
    case "SHIPPED":
      return {
        icon: Truck,
        label: "Shipped",
        className: "bg-blue-100 text-blue-700",
      };
    case "PENDING":
      return {
        icon: Clock,
        label: "Pending",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "CONFIRMED":
      return {
        icon: BadgeCheck,
        label: "Confirmed",
        className: "bg-purple-100 text-purple-700",
      };
    case "CANCELLED":
      return {
        icon: Ban,
        label: "Cancelled",
        className: "bg-red-100 text-red-700",
      };

    default:
      return {
        icon: Package,
        label: status,
        className: "bg-muted text-muted-foreground",
      };
  }
};

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse>();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Form states for edit profile
  const [editForm, setEditForm] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
  });

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response);
      console.log(response);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (showOrderModal || showEditProfileModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showOrderModal, showEditProfileModal]);

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleEditProfile = () => {
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = () => {
    // Handle save profile logic here
    console.log("Saving profile:", editForm);
    setShowEditProfileModal(false);
  };

  const tabs = [
    { value: "overview", label: "Overview", icon: User },
    { value: "orders", label: "Orders", icon: Package },
    { value: "addresses", label: "Addresses", icon: MapPin },
    { value: "wishlist", label: "Wishlist", icon: Heart },
    { value: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-full">
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                Lauka
              </h1>
            </Link>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="sm:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-6">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Button>
                  </Link>
                  <Separator className="my-2" />
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.value}
                        variant={activeTab === tab.value ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setActiveTab(tab.value);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </Button>
                    );
                  })}
                  <Separator className="my-2" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container-custom py-4 sm:py-8">
        {/* Profile Header Card */}
        <Card className="mb-4 sm:mb-8 shadow-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary/20">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl font-bold">
                  {mockUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground font-nunito">
                  {mockUser.name}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {mockUser.email}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Member since {mockUser.memberSince}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 justify-center sm:justify-start">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    Premium Member
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-primary text-primary"
                  >
                    🥕 15 Orders
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto"
                onClick={handleEditProfile}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content with Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          {/* Desktop Tabs */}
          <TabsList className="hidden sm:flex bg-card border border-border p-1 w-full justify-start gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    15
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Total Orders
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-red-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {mockWishlist.length}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Wishlist Items
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-card hover:shadow-card-hover transition-shadow sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    रू480.49
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Total Spent
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders Preview */}
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  Recent Orders
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("orders")}
                  className="text-primary text-xs sm:text-sm"
                >
                  View All{" "}
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 sm:p-2 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {orders.slice(0, 2).map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <div
                        key={order.order_id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-card flex items-center justify-center overflow-hidden shrink-0">
                          <Package className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm sm:text-base text-foreground">
                            {order.order_code}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {order.items.length} items • 24 Dec, 2025
                          </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <p className="font-bold text-sm sm:text-base text-foreground">
                              रू{Number(order.total_price).toFixed(2)}
                            </p>
                            <Badge
                              className={`${statusConfig.className} text-xs`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-3 sm:space-y-4">
            <Card className="shadow-card">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {orders.length === 0 ? (
                    <>
                      <div className="">
                        <div className="text-center max-w-md mx-auto">
                          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <h1 className="text-2xl font-bold mb-4">
                            Empty Order
                          </h1>
                          <p className="text-muted-foreground mb-8">
                            Looks like you haven't ordered any products yet. Start
                            ordering to see order status
                          </p>
                          <Link href="/products">
                            <Button className="btn-primary">
                              Start Shopping
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {orders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                          <div
                            key={order.order_id}
                            className="flex flex-col gap-3 p-3 sm:p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
                          >
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                <Package className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                  <p className="font-semibold text-sm sm:text-base text-foreground">
                                    {order.order_code}
                                  </p>
                                  <Badge
                                    className={`${statusConfig.className} text-xs w-fit`}
                                  >
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusConfig.label}
                                  </Badge>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  {order.items.length} items • Ordered on Dec
                                  28, 2024
                                </p>
                                <p className="text-base sm:text-xl font-bold text-foreground mt-2">
                                  रू{Number(order.total_price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto"
                              onClick={() => handleViewOrderDetails(order)}
                            >
                              View Details{" "}
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-3 sm:space-y-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  Saved Addresses
                </CardTitle>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Add
                </Button>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {mockAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-xl border-2 ${
                        address.isDefault
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              address.isDefault
                                ? "border-primary text-primary"
                                : ""
                            }`}
                          >
                            {address.type}
                          </Badge>
                          {address.isDefault && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        {address.name}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {address.address}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {address.city}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-3 sm:space-y-4">
            <Card className="shadow-card">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  My Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {mockWishlist.map((item) => (
                    <div
                      key={item.id}
                      className="card-product p-3 sm:p-4 group"
                    >
                      <div className="aspect-square rounded-lg bg-muted mb-2 sm:mb-3 flex items-center justify-center overflow-hidden">
                        <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm sm:text-lg font-bold text-primary">
                        रू{item.price.toFixed(2)}
                      </p>
                      <div className="flex gap-2 mt-2 sm:mt-3">
                        <Button
                          size="sm"
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                        >
                          Add to Cart
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 sm:h-9 sm:w-9 border-destructive text-destructive hover:bg-destructive hover:text-primary-foreground"
                        >
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-3 sm:space-y-4">
            <Card className="shadow-card">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                <div
                  className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  onClick={handleEditProfile}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        Personal Information
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Update your name, email, and phone
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                </div>

                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        Payment Methods
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Manage your payment options
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                </div>

                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        Notifications
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Configure email and push notifications
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-destructive/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-destructive">
                        Sign Out
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Log out of your account
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowOrderModal(false)}
          />
          <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-4 sm:p-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Order Details
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {selectedOrder.order_code}
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
                    Dec 24, 2025
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
                          {item.product_name}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-sm sm:text-base text-foreground">
                        रू{Number(item.price).toFixed(2)}
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
                      {selectedOrder.shipping_address}
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
                      Cash on Delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-border pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <p className="text-base sm:text-lg font-semibold text-foreground">
                    Total Amount
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    रू{Number(selectedOrder.total_price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditProfileModal(false)}
          />
          <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="border-b border-border p-4 sm:p-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Edit Profile
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditProfileModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3 mb-4">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary/20">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl font-bold">
                    {mockUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="pl-10"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="pl-10"
                    placeholder="Enter your phone"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowEditProfileModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleSaveProfile}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
