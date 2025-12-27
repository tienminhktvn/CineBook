import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Film } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  DataTable,
  Modal,
  Input,
  Textarea,
} from "../components";
import { movieService } from "../services";
import type { Movie, MovieInput } from "../types";
import toast from "react-hot-toast";

export const MoviesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<MovieInput>({
    title: "",
    genre: "",
    description: "",
    duration_minutes: 0,
    poster_url: "",
    release_date: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: () => movieService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: MovieInput) => movieService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie created successfully");
      closeModal();
    },
    onError: () => toast.error("Failed to create movie"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MovieInput> }) =>
      movieService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie updated successfully");
      closeModal();
    },
    onError: () => toast.error("Failed to update movie"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => movieService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie deleted successfully");
    },
    onError: () => toast.error("Failed to delete movie"),
  });

  const movies = data?.data || [];

  const openCreateModal = () => {
    setEditingMovie(null);
    setFormData({
      title: "",
      genre: "",
      description: "",
      duration_minutes: 0,
      poster_url: "",
      release_date: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      genre: movie.genre || "",
      description: movie.description || "",
      duration_minutes: movie.duration_minutes || 0,
      poster_url: movie.poster_url || "",
      release_date: movie.release_date?.split("T")[0] || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMovie(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMovie) {
      updateMutation.mutate({ id: editingMovie.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (movie: Movie) => {
    if (confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      deleteMutation.mutate(movie.id);
    }
  };

  const columns = [
    {
      key: "poster",
      header: "Poster",
      render: (movie: Movie) =>
        movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-12 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-12 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
            <Film className="w-6 h-6 text-slate-500" />
          </div>
        ),
    },
    { key: "title" as const, header: "Title" },
    { key: "genre" as const, header: "Genre" },
    {
      key: "duration_minutes" as const,
      header: "Duration",
      render: (movie: Movie) =>
        movie.duration_minutes ? `${movie.duration_minutes} min` : "-",
    },
    {
      key: "release_date" as const,
      header: "Release Date",
      render: (movie: Movie) =>
        movie.release_date
          ? new Date(movie.release_date).toLocaleDateString()
          : "-",
    },
    {
      key: "actions",
      header: "Actions",
      render: (movie: Movie) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(movie);
            }}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(movie);
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
          <h1 className="text-2xl font-bold text-white">Movies</h1>
          <p className="text-slate-400 mt-1">Manage your movie catalog</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          Add Movie
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">All Movies</h2>
            <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs text-slate-300">
              {movies.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={movies}
            isLoading={isLoading}
            emptyMessage="No movies found. Add your first movie!"
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingMovie ? "Edit Movie" : "Add New Movie"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="Enter movie title"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Genre"
              value={formData.genre}
              onChange={(e) =>
                setFormData({ ...formData, genre: e.target.value })
              }
              placeholder="e.g., Action, Comedy"
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={formData.duration_minutes || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration_minutes: parseInt(e.target.value) || 0,
                })
              }
              placeholder="e.g., 120"
            />
          </div>

          <Input
            label="Release Date"
            type="date"
            value={formData.release_date}
            onChange={(e) =>
              setFormData({ ...formData, release_date: e.target.value })
            }
          />

          <Input
            label="Poster URL"
            value={formData.poster_url}
            onChange={(e) =>
              setFormData({ ...formData, poster_url: e.target.value })
            }
            placeholder="https://example.com/poster.jpg"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            placeholder="Enter movie description"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingMovie ? "Update Movie" : "Create Movie"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
