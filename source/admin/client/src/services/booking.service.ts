import api from "./api";
import type { Booking, ApiResponse } from "../types";

export interface BookingSnackItem {
  snack_id: number;
  quantity: number;
}

export interface BookingInput {
  user_id: string;
  showtime_id: string;
  ticket_count?: number;
  snacks?: BookingSnackItem[];
  status?: Booking["status"];
}

export interface BookingUpdateInput {
  total_amount?: number;
  status?: Booking["status"];
}

// Simplified user type for booking dropdown
export interface BookingUser {
  id: string;
  username: string;
  email: string;
}

// Snack type for booking dropdown
export interface BookingSnack {
  id: number;
  name: string;
  unit_price: number;
  image_url?: string;
}

// Extended booking with snacks
export interface BookingWithSnacks extends Booking {
  snacks?: {
    id: number;
    name: string;
    quantity: number;
    price_at_booking: number;
  }[];
}

export const bookingService = {
  getAll: async (): Promise<ApiResponse<BookingWithSnacks[]>> => {
    const response = await api.get<ApiResponse<BookingWithSnacks[]>>(
      "/bookings"
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<BookingWithSnacks>> => {
    const response = await api.get<ApiResponse<BookingWithSnacks>>(
      `/bookings/${id}`
    );
    return response.data;
  },

  // Get users for booking dropdown (staff accessible)
  getUsersForBooking: async (): Promise<ApiResponse<BookingUser[]>> => {
    const response = await api.get<ApiResponse<BookingUser[]>>(
      "/bookings/users"
    );
    return response.data;
  },

  // Get snacks for booking dropdown
  getSnacksForBooking: async (): Promise<ApiResponse<BookingSnack[]>> => {
    const response = await api.get<ApiResponse<BookingSnack[]>>(
      "/bookings/snacks"
    );
    return response.data;
  },

  create: async (data: BookingInput): Promise<ApiResponse<Booking>> => {
    const response = await api.post<ApiResponse<Booking>>("/bookings", data);
    return response.data;
  },

  update: async (
    id: string,
    data: BookingUpdateInput
  ): Promise<ApiResponse<Booking>> => {
    const response = await api.put<ApiResponse<Booking>>(
      `/bookings/${id}`,
      data
    );
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: Booking["status"]
  ): Promise<ApiResponse<Booking>> => {
    const response = await api.put<ApiResponse<Booking>>(`/bookings/${id}`, {
      status,
    });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await api.delete<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  },

  getTotalRevenue: async (): Promise<
    ApiResponse<{ total_revenue: number }>
  > => {
    const response = await api.get("/bookings/revenue/total");
    return response.data;
  },
};
