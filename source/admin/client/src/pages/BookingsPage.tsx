import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ticket, Check, X, Trash2, Plus, Edit2, Coffee } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  DataTable,
  Button,
  Modal,
  Select,
  Input,
} from "../components";
import { bookingService, showtimeService } from "../services";
import type { Booking, Showtime } from "../types";
import type {
  BookingInput,
  BookingUpdateInput,
  BookingUser,
  BookingSnack,
  BookingWithSnacks,
} from "../services/booking.service";
import toast from "react-hot-toast";

interface SelectedSnack {
  snack_id: number;
  quantity: number;
  name: string;
  unit_price: number;
}

interface BookingFormData {
  user_id: string;
  showtime_id: string;
  ticket_count: string;
  status: Booking["status"];
}

const initialFormData: BookingFormData = {
  user_id: "",
  showtime_id: "",
  ticket_count: "1",
  status: "pending",
};

export const BookingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] =
    useState<BookingWithSnacks | null>(null);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [selectedSnacks, setSelectedSnacks] = useState<SelectedSnack[]>([]);

  // Queries
  const { data, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => bookingService.getAll(),
  });

  const { data: showtimesData } = useQuery({
    queryKey: ["showtimes", "future"],
    queryFn: () => showtimeService.getFuture(),
  });

  const { data: usersData } = useQuery({
    queryKey: ["bookings", "users"],
    queryFn: () => bookingService.getUsersForBooking(),
  });

  const { data: snacksData } = useQuery({
    queryKey: ["bookings", "snacks"],
    queryFn: () => bookingService.getSnacksForBooking(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: BookingInput) => bookingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking created successfully");
      handleCloseModal();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to create booking");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BookingUpdateInput }) =>
      bookingService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking updated successfully");
      handleCloseModal();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update booking");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking["status"] }) =>
      bookingService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking status updated");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update booking");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking deleted");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to delete booking");
    },
  });

  const bookings = data?.data || [];
  const futureShowtimes = showtimesData?.data || [];
  const users = usersData?.data || [];
  const snacks = snacksData?.data || [];

  // Handlers
  const handleOpenCreate = () => {
    setEditingBooking(null);
    setFormData(initialFormData);
    setSelectedSnacks([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (booking: BookingWithSnacks) => {
    setEditingBooking(booking);
    setFormData({
      user_id: String(booking.user_id),
      showtime_id: String(booking.showtime_id),
      ticket_count: "1",
      status: booking.status,
    });
    setSelectedSnacks([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBooking(null);
    setFormData(initialFormData);
    setSelectedSnacks([]);
  };

  const handleAddSnack = (snackId: string) => {
    if (!snackId) return;
    const snack = snacks.find((s) => s.id === parseInt(snackId));
    if (!snack) return;

    const existing = selectedSnacks.find((s) => s.snack_id === snack.id);
    if (existing) {
      setSelectedSnacks(
        selectedSnacks.map((s) =>
          s.snack_id === snack.id ? { ...s, quantity: s.quantity + 1 } : s
        )
      );
    } else {
      setSelectedSnacks([
        ...selectedSnacks,
        {
          snack_id: snack.id,
          quantity: 1,
          name: snack.name,
          unit_price: snack.unit_price,
        },
      ]);
    }
  };

  const handleRemoveSnack = (snackId: number) => {
    setSelectedSnacks(selectedSnacks.filter((s) => s.snack_id !== snackId));
  };

  const handleSnackQuantityChange = (snackId: number, quantity: number) => {
    if (quantity < 1) {
      handleRemoveSnack(snackId);
      return;
    }
    setSelectedSnacks(
      selectedSnacks.map((s) =>
        s.snack_id === snackId ? { ...s, quantity } : s
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBooking) {
      updateMutation.mutate({
        id: editingBooking.id,
        data: {
          status: formData.status,
        },
      });
    } else {
      if (!formData.user_id || !formData.showtime_id) {
        toast.error("Please select a user and showtime");
        return;
      }
      createMutation.mutate({
        user_id: formData.user_id,
        showtime_id: formData.showtime_id,
        ticket_count: parseInt(formData.ticket_count) || 1,
        snacks: selectedSnacks.map((s) => ({
          snack_id: s.snack_id,
          quantity: s.quantity,
        })),
        status: formData.status,
      });
    }
  };

  const handleConfirm = (booking: BookingWithSnacks) => {
    updateStatusMutation.mutate({ id: booking.id, status: "confirmed" });
  };

  const handleCancel = (booking: BookingWithSnacks) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      updateStatusMutation.mutate({ id: booking.id, status: "cancelled" });
    }
  };

  const handleComplete = (booking: BookingWithSnacks) => {
    updateStatusMutation.mutate({ id: booking.id, status: "completed" });
  };

  const handleDelete = (booking: BookingWithSnacks) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      deleteMutation.mutate(booking.id);
    }
  };

  // Format helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatShowtimeLabel = (showtime: Showtime) => {
    const startDate = new Date(showtime.start_time);
    return `#${
      showtime.id
    } - ${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${formatCurrency(showtime.base_price)}`;
  };

  const getUserName = (userId: string | number) => {
    const user = users.find(
      (u: BookingUser) => String(u.id) === String(userId)
    );
    return user?.username || String(userId);
  };

  // Calculate estimated total
  const calculateEstimatedTotal = () => {
    const showtime = futureShowtimes.find(
      (st) => String(st.id) === formData.showtime_id
    );
    const ticketTotal = showtime
      ? showtime.base_price * (parseInt(formData.ticket_count) || 1)
      : 0;
    const snackTotal = selectedSnacks.reduce(
      (sum, s) => sum + s.unit_price * s.quantity,
      0
    );
    return ticketTotal + snackTotal;
  };

  // Status colors
  const statusColors: Record<string, string> = {
    pending: "bg-[#f5c518]/20 text-[#f5c518]",
    confirmed: "bg-[#3bb33b]/20 text-[#3bb33b]",
    cancelled: "bg-[#f54336]/20 text-[#f54336]",
    completed: "bg-[#5799ef]/20 text-[#5799ef]",
  };

  // Table columns
  const columns = [
    {
      key: "id" as const,
      header: "Booking ID",
      render: (item: BookingWithSnacks) => (
        <span className="font-mono text-xs text-[#aaa]">
          {item.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      key: "user_id" as const,
      header: "User",
      render: (item: BookingWithSnacks) => (
        <span className="text-white">{getUserName(item.user_id)}</span>
      ),
    },
    {
      key: "showtime_id" as const,
      header: "Showtime",
      render: (item: BookingWithSnacks) => (
        <span className="font-mono text-[#aaa]">#{item.showtime_id}</span>
      ),
    },
    {
      key: "snacks" as const,
      header: "Snacks",
      render: (item: BookingWithSnacks) => (
        <div className="flex items-center gap-1">
          {item.snacks && item.snacks.length > 0 ? (
            <span className="flex items-center gap-1 text-[#f5c518]">
              <Coffee className="w-3 h-3" />
              {item.snacks.length}
            </span>
          ) : (
            <span className="text-[#555]">-</span>
          )}
        </div>
      ),
    },
    {
      key: "total_amount" as const,
      header: "Amount",
      render: (item: BookingWithSnacks) => (
        <span className="text-[#f5c518] font-medium">
          {formatCurrency(item.total_amount)}
        </span>
      ),
    },
    {
      key: "status" as const,
      header: "Status",
      render: (item: BookingWithSnacks) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium capitalize ${
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
      render: (booking: BookingWithSnacks) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(booking);
            }}
            className="p-2 text-[#777] hover:text-[#f5c518] hover:bg-[#333] rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {booking.status === "pending" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm(booking);
                }}
                className="p-2 text-[#777] hover:text-[#3bb33b] hover:bg-[#333] rounded-lg transition-colors"
                title="Confirm"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel(booking);
                }}
                className="p-2 text-[#777] hover:text-[#f5c518] hover:bg-[#333] rounded-lg transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {booking.status === "confirmed" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleComplete(booking);
              }}
              className="p-2 text-[#777] hover:text-[#5799ef] hover:bg-[#333] rounded-lg transition-colors"
              title="Mark Completed"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(booking);
            }}
            className="p-2 text-[#777] hover:text-[#f54336] hover:bg-[#333] rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Stats
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;

  // Status options
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" },
  ];

  // User options
  const userOptions = [
    { value: "", label: "Select a user" },
    ...users.map((user: BookingUser) => ({
      value: String(user.id),
      label: `${user.username} (${user.email})`,
    })),
  ];

  // Showtime options
  const showtimeOptions = [
    { value: "", label: "Select a showtime" },
    ...futureShowtimes.map((st: Showtime) => ({
      value: st.id.toString(),
      label: formatShowtimeLabel(st),
    })),
  ];

  // Snack options
  const snackOptions = [
    { value: "", label: "Add a snack..." },
    ...snacks.map((snack: BookingSnack) => ({
      value: snack.id.toString(),
      label: `${snack.name} - ${formatCurrency(snack.unit_price)}`,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-[#777] mt-1">Manage customer bookings</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Booking
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1c1c1c] border border-[#333] rounded-lg p-4">
          <p className="text-[#777] text-sm">Total Bookings</p>
          <p className="text-2xl font-bold text-white mt-1">
            {bookings.length}
          </p>
        </div>
        <div className="bg-[#f5c518]/10 border border-[#f5c518]/20 rounded-lg p-4">
          <p className="text-[#f5c518] text-sm">Pending</p>
          <p className="text-2xl font-bold text-[#f5c518] mt-1">
            {pendingCount}
          </p>
        </div>
        <div className="bg-[#3bb33b]/10 border border-[#3bb33b]/20 rounded-lg p-4">
          <p className="text-[#3bb33b] text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-[#3bb33b] mt-1">
            {confirmedCount}
          </p>
        </div>
        <div className="bg-[#5799ef]/10 border border-[#5799ef]/20 rounded-lg p-4">
          <p className="text-[#5799ef] text-sm">Completed</p>
          <p className="text-2xl font-bold text-[#5799ef] mt-1">
            {completedCount}
          </p>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Ticket className="w-5 h-5 text-[#f5c518]" />
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBooking ? "Edit Booking" : "Create Booking"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingBooking && (
            <>
              <Select
                label="User"
                options={userOptions}
                value={formData.user_id}
                onChange={(e) =>
                  setFormData({ ...formData, user_id: e.target.value })
                }
                required
              />
              <Select
                label="Showtime (Future only)"
                options={showtimeOptions}
                value={formData.showtime_id}
                onChange={(e) =>
                  setFormData({ ...formData, showtime_id: e.target.value })
                }
                required
              />
              {futureShowtimes.length === 0 && (
                <p className="text-[#f5c518] text-sm">
                  No future showtimes available. Please create a showtime first.
                </p>
              )}

              <Input
                label="Number of Tickets"
                type="number"
                min="1"
                max="10"
                placeholder="1"
                value={formData.ticket_count}
                onChange={(e) =>
                  setFormData({ ...formData, ticket_count: e.target.value })
                }
              />

              {/* Snacks Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#aaa]">
                  Add Snacks (Optional)
                </label>
                <Select
                  options={snackOptions}
                  value=""
                  onChange={(e) => handleAddSnack(e.target.value)}
                />

                {selectedSnacks.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedSnacks.map((snack) => (
                      <div
                        key={snack.snack_id}
                        className="flex items-center justify-between bg-[#2a2a2a] rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Coffee className="w-4 h-4 text-[#f5c518]" />
                          <span className="text-white">{snack.name}</span>
                          <span className="text-[#777]">
                            {formatCurrency(snack.unit_price)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleSnackQuantityChange(
                                snack.snack_id,
                                snack.quantity - 1
                              )
                            }
                            className="w-6 h-6 rounded bg-[#333] text-white hover:bg-[#444]"
                          >
                            -
                          </button>
                          <span className="text-white w-6 text-center">
                            {snack.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleSnackQuantityChange(
                                snack.snack_id,
                                snack.quantity + 1
                              )
                            }
                            className="w-6 h-6 rounded bg-[#333] text-white hover:bg-[#444]"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSnack(snack.snack_id)}
                            className="ml-2 text-[#f54336] hover:text-[#ff6659]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Estimated Total */}
              {formData.showtime_id && (
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#aaa]">Estimated Total</span>
                    <span className="text-xl font-bold text-[#f5c518]">
                      {formatCurrency(calculateEstimatedTotal())}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Booking["status"],
              })
            }
          />

          {editingBooking?.status === "completed" && (
            <p className="text-[#f54336] text-sm">
              ⚠️ Completed bookings cannot be modified.
            </p>
          )}
          {editingBooking?.status === "cancelled" && (
            <p className="text-[#f54336] text-sm">
              ⚠️ Cancelled bookings cannot be modified.
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
              disabled={
                editingBooking?.status === "completed" ||
                editingBooking?.status === "cancelled"
              }
            >
              {editingBooking ? "Update Booking" : "Create Booking"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
