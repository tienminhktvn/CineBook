import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
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
import { hallService } from "../services";
import type { Hall, HallInput, HallWithSeatsInput } from "../types";
import toast from "react-hot-toast";

export const HallsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithSeats, setIsWithSeats] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [formData, setFormData] = useState<
    HallInput & { row_count?: number; col_count?: number }
  >({
    name: "",
    total_seats: 0,
    status: "active",
    row_count: 10,
    col_count: 12,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["halls"],
    queryFn: () => hallService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: HallInput) => hallService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Hall created successfully");
      closeModal();
    },
    onError: () => toast.error("Failed to create hall"),
  });

  const createWithSeatsMutation = useMutation({
    mutationFn: (data: HallWithSeatsInput) => hallService.createWithSeats(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Hall with seats created successfully");
      closeModal();
    },
    onError: () => toast.error("Failed to create hall with seats"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<HallInput> }) =>
      hallService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Hall updated successfully");
      closeModal();
    },
    onError: () => toast.error("Failed to update hall"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => hallService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Hall deleted successfully");
    },
    onError: () => toast.error("Failed to delete hall"),
  });

  const halls = data?.data || [];

  const openCreateModal = (withSeats: boolean = false) => {
    setEditingHall(null);
    setIsWithSeats(withSeats);
    setFormData({
      name: "",
      total_seats: 0,
      status: "active",
      row_count: 10,
      col_count: 12,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (hall: Hall) => {
    setEditingHall(hall);
    setIsWithSeats(false);
    setFormData({
      name: hall.name,
      total_seats: hall.total_seats,
      status: hall.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHall(null);
    setIsWithSeats(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHall) {
      updateMutation.mutate({
        id: editingHall.id,
        data: {
          name: formData.name,
          status: formData.status,
          total_seats: formData.total_seats,
        },
      });
    } else if (isWithSeats) {
      createWithSeatsMutation.mutate({
        name: formData.name,
        status: formData.status,
        row_count: formData.row_count || 10,
        col_count: formData.col_count || 12,
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        total_seats: formData.total_seats,
        status: formData.status,
      });
    }
  };

  const handleDelete = (hall: Hall) => {
    if (confirm(`Are you sure you want to delete "${hall.name}"?`)) {
      deleteMutation.mutate(hall.id);
    }
  };

  const columns = [
    { key: "id" as const, header: "ID" },
    { key: "name" as const, header: "Name" },
    { key: "total_seats" as const, header: "Total Seats" },
    {
      key: "status" as const,
      header: "Status",
      render: (hall: Hall) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            hall.status === "active"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-amber-500/20 text-amber-400"
          }`}
        >
          {hall.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (hall: Hall) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(hall);
            }}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(hall);
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
          <h1 className="text-2xl font-bold text-white">Cinema Halls</h1>
          <p className="text-slate-400 mt-1">Manage your cinema halls</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => openCreateModal(false)}>
            <Plus className="w-4 h-4" />
            Add Hall
          </Button>
          <Button onClick={() => openCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Add Hall with Seats
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">All Halls</h2>
            <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs text-slate-300">
              {halls.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={halls}
            isLoading={isLoading}
            emptyMessage="No halls found. Add your first hall!"
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingHall
            ? "Edit Hall"
            : isWithSeats
            ? "Add Hall with Auto-Generated Seats"
            : "Add New Hall"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Hall Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g., Hall 1 (IMAX)"
          />

          {isWithSeats ? (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Number of Rows"
                type="number"
                value={formData.row_count || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    row_count: parseInt(e.target.value) || 0,
                  })
                }
                required
                min={1}
                max={26}
                placeholder="e.g., 10"
              />
              <Input
                label="Seats per Row"
                type="number"
                value={formData.col_count || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    col_count: parseInt(e.target.value) || 0,
                  })
                }
                required
                min={1}
                placeholder="e.g., 12"
              />
            </div>
          ) : (
            <Input
              label="Total Seats"
              type="number"
              value={formData.total_seats || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  total_seats: parseInt(e.target.value) || 0,
                })
              }
              placeholder="e.g., 120"
            />
          )}

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as "active" | "maintenance",
              })
            }
            options={[
              { value: "active", label: "Active" },
              { value: "maintenance", label: "Maintenance" },
            ]}
          />

          {isWithSeats && (
            <p className="text-sm text-slate-400">
              Total seats will be calculated:{" "}
              {(formData.row_count || 0) * (formData.col_count || 0)} seats
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={
                createMutation.isPending ||
                createWithSeatsMutation.isPending ||
                updateMutation.isPending
              }
            >
              {editingHall ? "Update Hall" : "Create Hall"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
