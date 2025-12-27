import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Coffee, Plus, Edit2, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  DataTable,
  Button,
  Modal,
  Input,
} from "../components";
import { snackService } from "../services";
import type { Snack, SnackInput } from "../services/snack.service";
import toast from "react-hot-toast";
import { formatCurrency } from "../helper";

interface SnackFormData {
  name: string;
  unit_price: string;
  image_url: string;
}

const initialFormData: SnackFormData = {
  name: "",
  unit_price: "",
  image_url: "",
};

export const SnacksPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnack, setEditingSnack] = useState<Snack | null>(null);
  const [formData, setFormData] = useState<SnackFormData>(initialFormData);

  // Query
  const { data, isLoading } = useQuery({
    queryKey: ["snacks"],
    queryFn: () => snackService.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: SnackInput) => snackService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snacks"] });
      toast.success("Snack created successfully");
      handleCloseModal();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to create snack");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SnackInput> }) =>
      snackService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snacks"] });
      toast.success("Snack updated successfully");
      handleCloseModal();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update snack");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => snackService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snacks"] });
      toast.success("Snack deleted successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to delete snack");
    },
  });

  const snacks = data?.data || [];

  // Handlers
  const handleOpenCreate = () => {
    setEditingSnack(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (snack: Snack) => {
    setEditingSnack(snack);
    setFormData({
      name: snack.name,
      unit_price: snack.unit_price.toString(),
      image_url: snack.image_url || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSnack(null);
    setFormData(initialFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.unit_price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const snackData: SnackInput = {
      name: formData.name,
      unit_price: parseFloat(formData.unit_price),
      image_url: formData.image_url || undefined,
    };

    if (editingSnack) {
      updateMutation.mutate({ id: editingSnack.id, data: snackData });
    } else {
      createMutation.mutate(snackData);
    }
  };

  const handleDelete = (snack: Snack) => {
    if (confirm(`Are you sure you want to delete "${snack.name}"?`)) {
      deleteMutation.mutate(snack.id);
    }
  };

  // Table columns
  const columns = [
    {
      key: "id" as const,
      header: "ID",
      render: (item: Snack) => (
        <span className="font-mono text-[#aaa]">#{item.id}</span>
      ),
    },
    {
      key: "image" as const,
      header: "Image",
      render: (item: Snack) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#333]">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Coffee className="w-6 h-6 text-[#666]" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name" as const,
      header: "Name",
      render: (item: Snack) => (
        <span className="text-white font-medium">{item.name}</span>
      ),
    },
    {
      key: "unit_price" as const,
      header: "Price",
      render: (item: Snack) => (
        <span className="text-[#f5c518] font-medium">
          {formatCurrency(item.unit_price)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (snack: Snack) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(snack);
            }}
            className="p-2 text-[#777] hover:text-[#f5c518] hover:bg-[#333] rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(snack);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Snacks</h1>
          <p className="text-[#777] mt-1">Manage snacks and combos</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Snack
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1c1c1c] border border-[#333] rounded-lg p-4">
          <p className="text-[#777] text-sm">Total Snacks</p>
          <p className="text-2xl font-bold text-white mt-1">{snacks.length}</p>
        </div>
        <div className="bg-[#f5c518]/10 border border-[#f5c518]/20 rounded-lg p-4">
          <p className="text-[#f5c518] text-sm">Avg. Price</p>
          <p className="text-2xl font-bold text-[#f5c518] mt-1">
            {snacks.length > 0
              ? formatCurrency(
                  snacks.reduce(
                    (sum, s) => sum + parseFloat(String(s.unit_price)),
                    0
                  ) / snacks.length
                )
              : formatCurrency(0)}
          </p>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Coffee className="w-5 h-5 text-[#f5c518]" />
            <h2 className="text-lg font-semibold text-white">All Snacks</h2>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={snacks}
            isLoading={isLoading}
            emptyMessage="No snacks yet. Add your first snack!"
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSnack ? "Edit Snack" : "Add Snack"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name *"
            type="text"
            placeholder="e.g., Popcorn Large"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Unit Price (VND) *"
            type="number"
            min="0"
            step="1000"
            placeholder="e.g., 50000"
            value={formData.unit_price}
            onChange={(e) =>
              setFormData({ ...formData, unit_price: e.target.value })
            }
            required
          />
          <Input
            label="Image URL"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
          />

          {/* Image preview */}
          {formData.image_url && (
            <div className="mt-2">
              <p className="text-sm text-[#777] mb-2">Preview:</p>
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingSnack ? "Update Snack" : "Create Snack"}
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
