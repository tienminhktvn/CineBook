import api from "./api";
import type { User, UserInput, ApiResponse } from "../types";

export const userService = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<User[]>>("/users");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  create: async (data: UserInput): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>("/users", data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<UserInput>
  ): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/users/${id}`
    );
    return response.data;
  },
};
