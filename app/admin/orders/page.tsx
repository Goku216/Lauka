"use client"
import  { useEffect, useState } from 'react';
import { Eye, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/Admin/DataTable';
import { OrderDetailsModal } from '@/components/Admin/OrderDetailsModal';
import { Order, OrderStatus } from '@/types';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { changeOrderStatus, getAllOrders } from '@/service/OrderApi';
import { toast } from 'sonner';


export const statusColors: Record<OrderStatus, string> = {
  CONFIRMED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  SHIPPED: 'bg-blue-100 text-blue-700 dark:bg-blue-100 dark:text-blue-400',
  DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchAllOrders()
  }, [currentPage])

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
        const response = await changeOrderStatus(orderId, newStatus)
        toast.success(response.message)
        setOrders(prev =>
      prev.map(order =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      )
    );
    if (selectedOrder?.order_id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
      } catch(error: any) {
        console.log(error)
        toast.error(error.message)
      }
 
  };

 

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const response = await getAllOrders({
        page: currentPage,
        limit: 10,
      })
      setOrders(response.results || [])
      setTotalItems(response.count || 0);
    } catch(error: any) {
      toast.error(error.message)
       setOrders([])
      setTotalItems(0);
    }
    finally {
      setLoading(false)
    }
  } 

  const columns = [
    {
      key: 'order_code',
      title: 'Order ID',
      render: (item: Order) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">{item.order_code}</span>
        </div>
      ),
    },
    {
      key: 'full_name',
      title: 'Customer',
      render: (item: Order ) => (
        <span className="text-sm">{item.full_name}</span>
      ),
    },
    {
      key: 'items',
      title: 'Items',
      render: (item: Order) => (
        <span className="text-sm text-muted-foreground">
          {item.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
        </span>
      ),
    },
    {
      key: 'total_price',
      title: 'Total',
      render: (item: Order ) => (
        <span className="font-semibold text-sm">Rs. {item.total_price}</span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (item: Order ) => (
        <Badge className={`${statusColors[item.status]} border-0`}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (item: Order) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewDetails(item)}
          className="gap-1"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
      </div>
      {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3> 
              </div>
            ) : (

      <DataTable
        data={orders}
        columns={columns}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        pageSize={10}
        isLoading={loading}
        serverPagination={true}
        
      />
        )}

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
    </AdminLayout>
  );
}
