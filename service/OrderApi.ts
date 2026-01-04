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


export const bulkAddToCart = async (data: cartPayload[]): Promise<any> => {

    try {
        const response = await apiClient.post("/cart/bulk-add/", data)
        return response

    } catch(error: any) {
        const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed Sending Verification"

    throw new Error(message)
    }

}

export const createOrder = async (data: OrderPayload): Promise<any> => {

    try {
        const response = await apiClient.post("/orders/create/", data)
        return response

    } catch(error: any) {
        const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed Sending Verification"

    throw new Error(message)
    }

}