import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar, MobileHeader } from "./Sidebar";
import { useAuth } from "../../context";

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#f5c518] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Top header with hamburger menu */}
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

      {/* Slide-out sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content - full width with top padding for header */}
      <main className="pt-16 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
