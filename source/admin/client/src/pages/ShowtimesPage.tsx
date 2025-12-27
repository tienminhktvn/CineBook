import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  DataTable,
  Modal,
  Input,
  Select,
} from "../components";
import { showtimeService, movieService, hallService } from "../services";
import type { Showtime, ShowtimeInput } from "../types";
import toast from "react-hot-toast";
import { formatCurrency, formatDateTime } from "../helper";

export const ShowtimesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [formData, setFormData] = useState<ShowtimeInput>({
    movie_id: 0,
    hall_id: 0,
    start_time: "",
    end_time: "",
    base_price: 0,
  });

  const { data: showtimesData, isLoading } = useQuery({
    queryKey: ["showtimes"],
    queryFn: () => showtimeService.getAll(),
  });

  const { data: moviesData } = useQuery({
    queryKey: ["movies"],
    queryFn: () => movieService.getAll(),
  });

  const { data: hallsData } = useQuery({
    queryKey: ["halls"],
    queryFn: () => hallService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: ShowtimeInput) => showtimeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
      toast.success("Showtime created successfully");
      closeModal();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to create showtime");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ShowtimeInput> }) =>
      showtimeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
      toast.success("Showtime updated successfully");
      closeModal();
    },
    onError: () => toast.error("Failed to update showtime"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => showtimeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
      toast.success("Showtime deleted successfully");
    },
    onError: () => toast.error("Failed to delete showtime"),
  });

  const showtimes = showtimesData?.data || [];
  const movies = moviesData?.data || [];
  const halls = hallsData?.data || [];

  const getMovieTitle = (movieId: number) => {
    return movies.find((m) => m.id === movieId)?.title || `Movie #${movieId}`;
  };

  const getHallName = (hallId: number) => {
    return halls.find((h) => h.id === hallId)?.name || `Hall #${hallId}`;
  };

  const openCreateModal = () => {
    setEditingShowtime(null);
    setFormData({
      movie_id: movies[0]?.id || 0,
      hall_id: halls[0]?.id || 0,
      start_time: "",
      end_time: "",
      base_price: 75000,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (showtime: Showtime) => {
    setEditingShowtime(showtime);
    setFormData({
      movie_id: showtime.movie_id,
      hall_id: showtime.hall_id,
      start_time: new Date(showtime.start_time).toISOString().slice(0, 16),
      end_time: new Date(showtime.end_time).toISOString().slice(0, 16),
      base_price: showtime.base_price,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingShowtime(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
    };

    if (editingShowtime) {
      updateMutation.mutate({ id: editingShowtime.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = (showtime: Showtime) => {
    if (confirm("Are you sure you want to delete this showtime?")) {
      deleteMutation.mutate(showtime.id);
    }
  };

  const columns = [
    { key: "id" as const, header: "ID" },
    {
      key: "movie_id" as const,
      header: "Movie",
      render: (item: Showtime) => getMovieTitle(item.movie_id),
    },
    {
      key: "hall_id" as const,
      header: "Hall",
      render: (item: Showtime) => getHallName(item.hall_id),
    },
    {
      key: "start_time" as const,
      header: "Start Time",
      render: (item: Showtime) => formatDateTime(item.start_time),
    },
    {
      key: "end_time" as const,
      header: "End Time",
      render: (item: Showtime) => formatDateTime(item.end_time),
    },
    {
      key: "base_price" as const,
      header: "Price",
      render: (item: Showtime) => formatCurrency(item.base_price),
    },
    {
      key: "actions",
      header: "Actions",
      render: (showtime: Showtime) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(showtime);
            }}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(showtime);
            }}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Showtimes</h1>
          <p className="text-slate-400 mt-1">Schedule movie screenings</p>
        </div>
        <Button
          onClick={openCreateModal}
          disabled={movies.length === 0 || halls.length === 0}
        >
          <Plus className="w-4 h-4" />
          Add Showtime
        </Button>
      </div>

      {(movies.length === 0 || halls.length === 0) && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-400">
          <p>You need at least one movie and one hall to create showtimes.</p>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">All Showtimes</h2>
            <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs text-slate-300">
              {showtimes.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={showtimes}
            isLoading={isLoading}
            emptyMessage="No showtimes scheduled yet"
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingShowtime ? "Edit Showtime" : "Add New Showtime"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Movie"
            value={formData.movie_id}
            onChange={(e) =>
              setFormData({ ...formData, movie_id: parseInt(e.target.value) })
            }
            options={movies.map((m) => ({ value: m.id, label: m.title }))}
          />

          <Select
            label="Hall"
            value={formData.hall_id}
            onChange={(e) =>
              setFormData({ ...formData, hall_id: parseInt(e.target.value) })
            }
            options={halls.map((h) => ({ value: h.id, label: h.name }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              required
            />
            <Input
              label="End Time"
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
              required
            />
          </div>

          <Input
            label="Base Price (VND)"
            type="number"
            value={formData.base_price || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                base_price: parseInt(e.target.value) || 0,
              })
            }
            required
            min={0}
            step={1000}
            placeholder="e.g., 75000"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingShowtime ? "Update Showtime" : "Create Showtime"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
