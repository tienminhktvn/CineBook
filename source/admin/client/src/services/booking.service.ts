import api from "./api";
import type { Booking, ApiResponse } from "../types";

export const bookingService = {
  getAll: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get<ApiResponse<Booking[]>>("/bookings");
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
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
