import api from "./api";
import type { ApiResponse } from "../types";

export interface Snack {
  id: number;
  name: string;
  unit_price: number;
  image_url?: string;
}

export interface SnackInput {
  name: string;
  unit_price: number;
  image_url?: string;
}

export const snackService = {
  getAll: async (): Promise<ApiResponse<Snack[]>> => {
    const response = await api.get<ApiResponse<Snack[]>>("/snacks");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Snack>> => {
    const response = await api.get<ApiResponse<Snack>>(`/snacks/${id}`);
    return response.data;
  },

  create: async (data: SnackInput): Promise<ApiResponse<Snack>> => {
    const response = await api.post<ApiResponse<Snack>>("/snacks", data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<SnackInput>
  ): Promise<ApiResponse<Snack>> => {
    const response = await api.put<ApiResponse<Snack>>(`/snacks/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/snacks/${id}`
    );
    return response.data;
  },
};
