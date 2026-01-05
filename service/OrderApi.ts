import { OrdersResponse } from "@/types";
import apiClient from "./ApiConfig/apiClient";

export interface cartPayload {
  product_reference_id: string;
  quantity: number;
}

export interface OrderPayload {
  shipping_address: string;
  phone_number: string;
  full_name: string;
  email?: string;
  district: string;
  city: string;
  order_notes?: string;
}

// Order Item
export interface OrderItem {
  reference_id: string;
  product: number;
  product_name: string;
  quantity: number;
  price: string; // keeping as string because API sends it as string
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

// Main Order Response
export interface OrderResponse {
  order_id: string;
  total_price: string;
  status: OrderStatus;
  shipping_address: string;
  order_code: string;
  phone_number: string;
  full_name: string;
  email: string;
  district: string;
  city: string;
  order_notes: string;
  items: OrderItem[];
}

export const bulkAddToCart = async (data: cartPayload[]): Promise<any> => {
  try {
    const response = await apiClient.post("/cart/bulk-add/", data);
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed Sending Verification";

    throw new Error(message);
  }
};

export const createOrder = async (data: OrderPayload): Promise<any> => {
  try {
    const response = await apiClient.post("/orders/create/", data);
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed Sending Verification";

    throw new Error(message);
  }
};
export const getOrders = async (): Promise<OrderResponse[]> => {
  try {
    const response = await apiClient.get<OrderResponse[]>("/orders");
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed Sending Verification";

    throw new Error(message);
  }
};

export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
}): Promise<OrdersResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("page_size", params.limit.toString());

  try {
    const response = await apiClient.get<OrdersResponse>(
      `/admin/orders?${queryParams.toString()}`
    );
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to fetch orders";

    throw new Error(message);
  }
};

export const changeOrderStatus = async (id: string, status: string): Promise<any> => {
  try {
    const response = await apiClient.patch(`/admin/orders/${id}/update/` , {
        status
    })
    return response
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to fetch orders";

    throw new Error(message);
  }
};
