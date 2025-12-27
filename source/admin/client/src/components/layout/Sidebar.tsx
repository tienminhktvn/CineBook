import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  Building2,
  Clock,
  Ticket,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/movies", icon: Film, label: "Movies" },
  { to: "/halls", icon: Building2, label: "Halls" },
  { to: "/showtimes", icon: Clock, label: "Showtimes" },
  { to: "/bookings", icon: Ticket, label: "Bookings" },
  { to: "/users", icon: Users, label: "Users", adminOnly: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose} />
      )}

      {/* Sidebar - IMDb dark theme */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 
          bg-[#1a1a1a] border-r border-[#333]
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header with IMDb-style logo */}
        <div className="flex items-center justify-between p-4 border-b border-[#333] shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#f5c518] rounded px-2 py-1">
              <Film className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">CineBook</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#aaa] hover:text-white hover:bg-[#333] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation - takes remaining space */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#f5c518] text-black font-semibold"
                      : "text-[#aaa] hover:bg-[#2a2a2a] hover:text-white"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
        </nav>

        {/* User section - fixed at bottom */}
        <div className="shrink-0 p-4 border-t border-[#333] bg-[#121212]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#f5c518] flex items-center justify-center text-black font-bold">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-medium truncate">
                {user?.username || "Admin"}
              </p>
              <p className="text-[#777] text-sm truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#333] text-[#aaa] rounded-lg hover:bg-[#444] hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export const MobileHeader: React.FC<{ onMenuClick: () => void }> = ({
  onMenuClick,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-[#121212] border-b border-[#333] px-4 py-3">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 text-[#aaa] hover:text-white hover:bg-[#333] rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-[#f5c518] rounded px-1.5 py-0.5">
            <Film className="w-5 h-5 text-black" />
          </div>
          <span className="text-lg font-bold text-white">CineBook</span>
        </div>
      </div>
    </header>
  );
};
