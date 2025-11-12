"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsersAction, updateUserAdmin, deleteUser } from "@/actions/user";
import type { UserListItem } from "@/actions/user/get-all-users.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users as UsersIcon,
  Loader2,
  UserCheck,
  UserX,
  Shield,
  UserPlus,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { USER_TYPE_FILTERS, USER_STATUS_FILTERS } from "./constants";
import { UsersTable } from "./components/users-table";
import { EditUserDialog } from "./components/edit-user-dialog";
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
} from "@/components/ui/alert-dialog";
import { UserType, UserStatus } from "@/core/domain/entities/User";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | UserType>("all");
  const [statusFilter, setStatusFilter] = useState<string | UserStatus>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", debouncedSearch, typeFilter, statusFilter],
    queryFn: async () => {
      const result = await getAllUsersAction({
        search: debouncedSearch || undefined,
        type: typeFilter !== "all" ? (typeFilter as UserType) : undefined,
        status:
          statusFilter !== "all" ? (statusFilter as UserStatus) : undefined,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch users");
      }

      return result;
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: { type: string; status: string };
    }) => {
      const result = await updateUserAdmin({
        userId,
        type: data.type as any,
        status: data.status as any,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to update user");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await deleteUser({ userId });

      if (!result.success) {
        throw new Error(result.error || "Failed to delete user");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  const handleEdit = (user: UserListItem) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: UserListItem) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleUpdateSubmit = async (
    userId: string,
    data: { type: string; status: string }
  ) => {
    console.log("Submitting update:", { userId, data });
    await updateMutation.mutateAsync({ userId, data });
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      await deleteMutation.mutateAsync(selectedUser.id);
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="py-0 border-blue-100 dark:border-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    totalUsers
                  )}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0 border-green-100 dark:border-green-900/20 hover:border-green-200 dark:hover:border-green-800/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    activeUsers
                  )}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-50 dark:bg-green-950/30 rounded-xl flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0 border-amber-100 dark:border-amber-900/20 hover:border-amber-200 dark:hover:border-amber-800/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    inactiveUsers
                  )}
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-50 dark:bg-amber-950/30 rounded-xl flex items-center justify-center">
                <UserX className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0 border-purple-100 dark:border-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    adminUsers
                  )}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">
                Search & Filter
              </h3>
              {(search || typeFilter !== "all" || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("all");
                    setStatusFilter("all");
                  }}
                  className="h-8"
                >
                  Clear all
                </Button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  {USER_TYPE_FILTERS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {USER_STATUS_FILTERS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">Users List</CardTitle>
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  "Loading users..."
                ) : (
                  <>
                    Showing {data?.users?.length || 0} of {totalUsers} users
                  </>
                )}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

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
