"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTrpc } from "@/client/lib/trpc";
import type { UserProps } from "@/server/core/domain/entities/User";
import { Input } from "@/client/components/ui/input";
import { Button } from "@/client/components/ui/button";
import {
  Search,
  Users as UsersIcon,
  Loader2,
  UserCheck,
  UserX,
  Shield,
  UserPlus,
  X,
} from "lucide-react";
import { useDebounce } from "@/client/hooks/use-debounce";
import { USER_TYPE_FILTERS, USER_STATUS_FILTERS } from "./constants";
import { UsersTable } from "./components/users-table";
import { EditUserDialog } from "./components/edit-user-dialog";
import { StatCard, StatsGrid } from "@/client/components/shared/stat-card";
import { SelectFilter } from "@/client/components/filters/select-filter";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/client/components/ui/alert-dialog";
import { UserType, UserStatus } from "@/server/core/domain/entities/User";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | UserType>("all");
  const [statusFilter, setStatusFilter] = useState<string | UserStatus>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useTrpc.user.getAll.useQuery({
    search: debouncedSearch || undefined,
    type: typeFilter !== "all" ? (typeFilter as UserType) : undefined,
    status: statusFilter !== "all" ? (statusFilter as UserStatus) : undefined,
  });

  // Update user mutation
  const updateMutation = useTrpc.user.updateAdmin.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["user", "getAll"]] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  // Delete user mutation
  const deleteMutation = useTrpc.user.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["user", "getAll"]] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  const handleEdit = (user: UserProps) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: UserProps) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleUpdateSubmit = async (
    userId: string,
    data: { type: string; status: string }
  ) => {
    console.log("Submitting update:", { userId, data });
    await updateMutation.mutateAsync({
      userId,
      type: data.type as UserType,
      status: data.status as UserStatus,
    });
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      await deleteMutation.mutateAsync({ userId: selectedUser.id });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  // Calculate stats
  const activeUsers =
    data?.users?.filter((u) => u.status === UserStatus.VISIBLE).length || 0;
  const inactiveUsers =
    data?.users?.filter(
      (u) => u.status === UserStatus.HIDDEN || u.status === UserStatus.DISABLED
    ).length || 0;
  const adminUsers =
    data?.users?.filter((u) => u.type === UserType.ADMIN).length || 0;
  const totalUsers = data?.total || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UsersIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage all users in the system
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsGrid cols={4}>
        <StatCard
          title="Total Users"
          value={isLoading ? "..." : totalUsers}
          icon={UsersIcon}
        />
        <StatCard
          title="Active"
          value={isLoading ? "..." : activeUsers}
          icon={UserCheck}
        />
        <StatCard
          title="Inactive"
          value={isLoading ? "..." : inactiveUsers}
          icon={UserX}
        />
        <StatCard
          title="Admins"
          value={isLoading ? "..." : adminUsers}
          icon={Shield}
        />
      </StatsGrid>

      {/* Filters + Table */}
      <div className="space-y-3">
        {/* Filters bar */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                onClick={() => setSearch("")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <div className="flex items-center">
            <SelectFilter
              options={USER_TYPE_FILTERS.filter((o) => o.value !== "all").map(
                (o) => ({ value: o.value, label: o.label })
              )}
              value={typeFilter}
              onChange={setTypeFilter}
              allLabel="All types"
              active={typeFilter !== "all"}
            />
            {typeFilter !== "all" && (
              <Button
                variant="default"
                size="sm"
                className="h-9 w-7 rounded-l-none px-0"
                onClick={() => setTypeFilter("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="flex items-center">
            <SelectFilter
              options={USER_STATUS_FILTERS.filter((o) => o.value !== "all").map(
                (o) => ({ value: o.value, label: o.label })
              )}
              value={statusFilter}
              onChange={setStatusFilter}
              allLabel="All statuses"
              active={statusFilter !== "all"}
            />
            {statusFilter !== "all" && (
              <Button
                variant="default"
                size="sm"
                className="h-9 w-7 rounded-l-none px-0"
                onClick={() => setStatusFilter("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {(search || typeFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
              className="h-9 gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Clear all
            </Button>
          )}
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground">
          {isLoading
            ? "Loading users..."
            : `${totalUsers} ${totalUsers === 1 ? "user" : "users"}${search || typeFilter !== "all" || statusFilter !== "all" ? " (filtered)" : ""}`}
        </p>

        {/* Table */}
        <div className="border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Loading users...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <UserX className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-lg font-semibold text-red-600 mb-2">
                Error loading users
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          ) : !data?.users || data.users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-3 bg-muted rounded-full mb-4">
                <UserPlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold mb-2">No users found</p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {search || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters or search query to find what you're looking for."
                  : "There are no users in the system yet."}
              </p>
            </div>
          ) : (
            <UsersTable
              users={data.users}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={selectedUser}
        onSubmit={handleUpdateSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user{" "}
              <strong>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </strong>{" "}
              ({selectedUser?.email}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
