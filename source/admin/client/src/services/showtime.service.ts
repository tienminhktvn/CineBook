import api from "./api";
import type { Showtime, ShowtimeInput, ApiResponse } from "../types";

export const showtimeService = {
  getAll: async (): Promise<ApiResponse<Showtime[]>> => {
    const response = await api.get<ApiResponse<Showtime[]>>("/showtimes");
    return response.data;
  },

  getFuture: async (): Promise<ApiResponse<Showtime[]>> => {
    const response = await api.get<ApiResponse<Showtime[]>>(
      "/showtimes/future"
    );
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Showtime>> => {
    const response = await api.get<ApiResponse<Showtime>>(`/showtimes/${id}`);
    return response.data;
  },

  create: async (data: ShowtimeInput): Promise<ApiResponse<Showtime>> => {
    const response = await api.post<ApiResponse<Showtime>>("/showtimes", data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<ShowtimeInput>
  ): Promise<ApiResponse<Showtime>> => {
    const response = await api.put<ApiResponse<Showtime>>(
      `/showtimes/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<Showtime>> => {
    const response = await api.delete<ApiResponse<Showtime>>(
      `/showtimes/${id}`
    );
    return response.data;
  },

  checkOverlap: async (data: {
    hall_id: number;
    start_time: string;
    end_time: string;
  }): Promise<ApiResponse<{ has_overlap: boolean; is_available: boolean }>> => {
    const response = await api.post("/showtimes/check-overlap", data);
    return response.data;
  },
};
