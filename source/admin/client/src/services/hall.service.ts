import api from "./api";
import type {
  Hall,
  HallInput,
  HallWithSeatsInput,
  ApiResponse,
} from "../types";

export const hallService = {
  getAll: async (): Promise<ApiResponse<Hall[]>> => {
    const response = await api.get<ApiResponse<Hall[]>>("/halls");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Hall>> => {
    const response = await api.get<ApiResponse<Hall>>(`/halls/${id}`);
    return response.data;
  },

  create: async (data: HallInput): Promise<ApiResponse<Hall>> => {
    const response = await api.post<ApiResponse<Hall>>("/halls", data);
    return response.data;
  },

  createWithSeats: async (
    data: HallWithSeatsInput
  ): Promise<ApiResponse<Hall>> => {
    const response = await api.post<ApiResponse<Hall>>(
      "/halls/with-seats",
      data
    );
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<HallInput>
  ): Promise<ApiResponse<Hall>> => {
    const response = await api.put<ApiResponse<Hall>>(`/halls/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<Hall>> => {
    const response = await api.delete<ApiResponse<Hall>>(`/halls/${id}`);
    return response.data;
  },
};
