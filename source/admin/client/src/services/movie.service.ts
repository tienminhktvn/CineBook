import api from "./api";
import type { Movie, MovieInput, ApiResponse } from "../types";

export const movieService = {
  getAll: async (): Promise<ApiResponse<Movie[]>> => {
    const response = await api.get<ApiResponse<Movie[]>>("/movies");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Movie>> => {
    const response = await api.get<ApiResponse<Movie>>(`/movies/${id}`);
    return response.data;
  },

  create: async (data: MovieInput): Promise<ApiResponse<Movie>> => {
    const response = await api.post<ApiResponse<Movie>>("/movies", data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<MovieInput>
  ): Promise<ApiResponse<Movie>> => {
    const response = await api.put<ApiResponse<Movie>>("/movies", {
      id,
      ...data,
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<Movie>> => {
    const response = await api.delete<ApiResponse<Movie>>("/movies", {
      data: { id },
    });
    return response.data;
  },
};
