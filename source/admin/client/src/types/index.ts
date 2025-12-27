// User types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  role: string;
  status: string;
  created_at: string;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  full_name?: string;
  phone_number?: string;
}

// User management types
export interface UserInput {
  username: string;
  password?: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  role?: "customer" | "admin" | "staff";
  status?: "active" | "blocked" | "pending";
}

// Movie types
export interface Movie {
  id: number;
  title: string;
  genre?: string;
  description?: string;
  duration_minutes?: number;
  poster_url?: string;
  release_date?: string;
  created_at?: string;
}

export interface MovieInput {
  title: string;
  genre?: string;
  description?: string;
  duration_minutes?: number;
  poster_url?: string;
  release_date?: string;
}

// Hall types
export interface Hall {
  id: number;
  name: string;
  total_seats: number;
  status: "active" | "maintenance";
}

export interface HallInput {
  name: string;
  total_seats?: number;
  status?: "active" | "maintenance";
}

export interface HallWithSeatsInput {
  name: string;
  status?: "active" | "maintenance";
  row_count: number;
  col_count: number;
}

// Showtime types
export interface Showtime {
  id: number;
  movie_id: number;
  hall_id: number;
  start_time: string;
  end_time: string;
  base_price: number;
}

export interface ShowtimeInput {
  movie_id: number;
  hall_id: number;
  start_time: string;
  end_time: string;
  base_price: number;
}

// Booking types
export interface Booking {
  id: string;
  user_id: number;
  showtime_id: number;
  booking_date: string;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  qr_code_hash?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: boolean;
  message: string;
}
