import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Shield,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
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
import { userService } from "../services";
import { useAuth } from "../context";
import type { User, UserInput } from "../types";
import toast from "react-hot-toast";

const roleOptions = [
  { value: "customer", label: "Customer" },
  { value: "staff", label: "Staff" },
  { value: "admin", label: "Admin" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "blocked", label: "Blocked" },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <ShieldCheck className="w-4 h-4 text-purple-400" />;
    case "staff":
      return <Shield className="w-4 h-4 text-blue-400" />;
    default:
      return <UserIcon className="w-4 h-4 text-slate-400" />;
  }
};

export const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserInput>({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    role: "customer",
    status: "active",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: UserInput) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
      closeModal();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserInput> }) =>
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
      closeModal();
    },
    onError: () => toast.error("Failed to update user"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });

  const users = data?.data || [];

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      full_name: "",
      phone_number: "",
      role: "customer",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      full_name: user.full_name || "",
      phone_number: user.phone_number || "",
      role: user.role as UserInput["role"],
      status: user.status as UserInput["status"],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // Don't send password if empty (not changing it)
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      updateMutation.mutate({ id: editingUser.id, data: updateData });
    } else {
      if (!formData.password) {
        toast.error("Password is required for new users");
        return;
      }
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error("Cannot delete your own account");
      return;
    }
    if (confirm(`Are you sure you want to delete "${user.username}"?`)) {
      deleteMutation.mutate(user.id);
    }
  };

  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400",
    pending: "bg-amber-500/20 text-amber-400",
    blocked: "bg-red-500/20 text-red-400",
  };

  const columns = [
    {
      key: "id" as const,
      header: "ID",
    },
    {
      key: "username" as const,
      header: "Username",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span>{user.username}</span>
        </div>
      ),
    },
    { key: "email" as const, header: "Email" },
    { key: "full_name" as const, header: "Full Name" },
    {
      key: "role" as const,
      header: "Role",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          {getRoleIcon(user.role)}
          <span className="capitalize">{user.role}</span>
        </div>
      ),
    },
    {
      key: "status" as const,
      header: "Status",
      render: (user: User) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
            statusColors[user.status] || ""
          }`}
        >
          {user.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(user);
            }}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(user);
            }}
            disabled={user.id === currentUser?.id}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 mt-1">
            Manage system users and their roles
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <p className="text-purple-400 text-sm">Admins</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-blue-400 text-sm">Staff</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {users.filter((u) => u.role === "staff").length}
          </p>
        </div>
        <div className="bg-slate-500/10 border border-slate-500/20 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Customers</p>
          <p className="text-2xl font-bold text-slate-300 mt-1">
            {users.filter((u) => u.role === "customer").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">All Users</h2>
            <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs text-slate-300">
              {users.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            emptyMessage="No users found"
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser ? "Edit User" : "Create New User"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              placeholder="john_doe"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="john@example.com"
            />
          </div>

          <Input
            label={
              editingUser
                ? "New Password (leave empty to keep current)"
                : "Password"
            }
            type="password"
            value={formData.password || ""}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required={!editingUser}
            placeholder="••••••••"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.full_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="John Doe"
            />
            <Input
              label="Phone Number"
              value={formData.phone_number || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              placeholder="0909123456"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Role"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as UserInput["role"],
                })
              }
              options={roleOptions}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as UserInput["status"],
                })
              }
              options={statusOptions}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingUser ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
