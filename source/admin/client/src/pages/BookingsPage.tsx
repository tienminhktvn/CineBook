import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ticket, Check, X, Trash2 } from "lucide-react";
import { Card, CardHeader, CardContent, DataTable } from "../components";
import { bookingService } from "../services";
import type { Booking } from "../types";
import toast from "react-hot-toast";

export const BookingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => bookingService.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking["status"] }) =>
      bookingService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking status updated");
    },
    onError: () => toast.error("Failed to update booking"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking deleted");
    },
    onError: () => toast.error("Failed to delete booking"),
  });

  const bookings = data?.data || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const handleConfirm = (booking: Booking) => {
    updateStatusMutation.mutate({ id: booking.id, status: "confirmed" });
  };

  const handleCancel = (booking: Booking) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      updateStatusMutation.mutate({ id: booking.id, status: "cancelled" });
    }
  };

  const handleDelete = (booking: Booking) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      deleteMutation.mutate(booking.id);
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-400",
    confirmed: "bg-emerald-500/20 text-emerald-400",
    cancelled: "bg-red-500/20 text-red-400",
    completed: "bg-blue-500/20 text-blue-400",
  };

  const columns = [
    {
      key: "id" as const,
      header: "Booking ID",
      render: (item: Booking) => (
        <span className="font-mono text-xs">{item.id.slice(0, 8)}...</span>
      ),
    },
    { key: "user_id" as const, header: "User ID" },
    { key: "showtime_id" as const, header: "Showtime ID" },
    {
      key: "booking_date" as const,
      header: "Booking Date",
      render: (item: Booking) => formatDate(item.booking_date),
    },
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
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
            statusColors[item.status] || ""
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (booking: Booking) => (
        <div className="flex items-center gap-1">
          {booking.status === "pending" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm(booking);
                }}
                className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition-colors"
                title="Confirm"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel(booking);
                }}
                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(booking);
            }}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-slate-400 mt-1">Manage customer bookings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Total Bookings</p>
          <p className="text-2xl font-bold text-white mt-1">
            {bookings.length}
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {pendingCount}
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-400 text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {confirmedCount}
          </p>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Ticket className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-semibold text-white">All Bookings</h2>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={bookings}
            isLoading={isLoading}
            emptyMessage="No bookings yet"
          />
        </CardContent>
      </Card>
    </div>
  );
};
