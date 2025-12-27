import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context";
import { AdminLayout } from "./components";
import {
  LoginPage,
  DashboardPage,
  MoviesPage,
  HallsPage,
  ShowtimesPage,
  BookingsPage,
  UsersPage,
  SnacksPage,
} from "./pages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route element={<AdminLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/halls" element={<HallsPage />} />
              <Route path="/showtimes" element={<ShowtimesPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/snacks" element={<SnacksPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Route>
          </Routes>
        </BrowserRouter>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1a1a1a",
              color: "#ffffff",
              border: "1px solid #333",
            },
            success: {
              iconTheme: {
                primary: "#f5c518",
                secondary: "#000000",
              },
            },
            error: {
              iconTheme: {
                primary: "#f54336",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
