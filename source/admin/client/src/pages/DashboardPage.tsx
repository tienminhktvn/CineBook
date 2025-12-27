import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Film,
  Building2,
  Clock,
  Ticket,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  StatsCard,
  Card,
  CardHeader,
  CardContent,
  DataTable,
} from "../components";
import {
  movieService,
  hallService,
  showtimeService,
  bookingService,
} from "../services";
import type { Booking } from "../types";

export const DashboardPage: React.FC = () => {
  const { data: moviesData } = useQuery({
    queryKey: ["movies"],
    queryFn: () => movieService.getAll(),
  });

  const { data: hallsData } = useQuery({
    queryKey: ["halls"],
    queryFn: () => hallService.getAll(),
  });

  const { data: showtimesData } = useQuery({
    queryKey: ["showtimes"],
    queryFn: () => showtimeService.getAll(),
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => bookingService.getAll(),
  });

  const { data: revenueData } = useQuery({
    queryKey: ["revenue"],
    queryFn: () => bookingService.getTotalRevenue(),
  });

  const movies = moviesData?.data || [];
  const halls = hallsData?.data || [];
  const showtimes = showtimesData?.data || [];
  const bookings = bookingsData?.data || [];
  const totalRevenue = revenueData?.data?.total_revenue || 0;

  const recentBookings = bookings.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const bookingColumns = [
    {
      key: "id" as const,
      header: "Booking ID",
      render: (item: Booking) => item.id.slice(0, 8) + "...",
    },
    { key: "showtime_id" as const, header: "Showtime" },
    {
      key: "total_amount" as const,
      header: "Amount",
      render: (item: Booking) => formatCurrency(item.total_amount),
    },
    {
      key: "status" as const,
      header: "Status",
      render: (item: Booking) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.status === "confirmed"
              ? "bg-emerald-500/20 text-emerald-400"
              : item.status === "pending"
              ? "bg-amber-500/20 text-amber-400"
              : item.status === "cancelled"
              ? "bg-red-500/20 text-red-400"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome to CineBook Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Movies"
          value={movies.length}
          icon={Film}
          color="indigo"
        />
        <StatsCard
          label="Cinema Halls"
          value={halls.length}
          icon={Building2}
          color="emerald"
        />
        <StatsCard
          label="Active Showtimes"
          value={showtimes.length}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          label="Total Bookings"
          value={bookings.length}
          icon={Ticket}
          color="rose"
        />
      </div>

      {/* Revenue Card */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-white mt-1">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">
              Recent Bookings
            </h2>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={bookingColumns}
            data={recentBookings}
            emptyMessage="No bookings yet"
          />
        </CardContent>
      </Card>
    </div>
  );
};
