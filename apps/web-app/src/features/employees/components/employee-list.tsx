"use client";

import { useState } from "react";
import { MoreHorizontal, Search, Building2, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { DataTableWithFilters } from "@/components/shared/data-table-with-filters";
import { useTranslation } from "@/i18n";
import { useBusiness } from "@/contexts";
import {
  getBusinessUsersWithDetails,
  BusinessUserWithDetails,
} from "@/actions/business-user/get-business-users-with-details.action";
import {
  createBusinessUser,
  updateBusinessUser,
  deleteBusinessUser,
} from "@/actions/business-user";
import { BusinessRole } from "@/core/domain/entities";
import { EmployeeDialog } from "./employee-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { useDebounce } from "@/hooks/use-debounce";

export function EmployeeList() {
  const { t } = useTranslation();
  const { currentBusiness } = useBusiness();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<
    | {
        id: string;
        userId: string;
        role: BusinessRole;
        firstName: string;
        lastName: string;
      }
    | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: employeesData, isLoading } = useQuery({
    queryKey: ["business-users", currentBusiness?.id, debouncedSearch],
    queryFn: async () => {
      if (!currentBusiness?.id) return null;
      const result = await getBusinessUsersWithDetails({
        businessId: currentBusiness.id,
        search: debouncedSearch,
      });
      return result.success ? result.businessUsers : [];
    },
    enabled: !!currentBusiness?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { userId: string; role: BusinessRole }) => {
      if (!currentBusiness?.id) throw new Error("No business selected");
      return await createBusinessUser({
        userId: data.userId,
        businessId: currentBusiness.id,
        role: data.role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-users"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; role: BusinessRole }) => {
      return await updateBusinessUser({
        id: data.id,
        role: data.role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteBusinessUser({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-users"] });
    },
  });

  const handleSubmit = async (data: { userId: string; role: BusinessRole }) => {
    if (editData) {
      await updateMutation.mutateAsync({ id: editData.id, role: data.role });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (employee: BusinessUserWithDetails) => {
    setEditData({
      id: employee.id,
      userId: employee.userId,
      role: employee.role,
      firstName: employee.user.firstName,
      lastName: employee.user.lastName,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (!currentBusiness) {
    return (
      <EmptyState
        icon={Building2}
        title="No business selected"
        description="Please select a business to manage employees"
      />
    );
  }

  const employees = employeesData || [];

  const columns = [
    {
      header: t.pages.clients.name,
      accessor: (item: BusinessUserWithDetails) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.user.pictureFullPath || undefined} />
            <AvatarFallback>
              {getInitials(item.user.firstName, item.user.lastName)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {item.user.firstName} {item.user.lastName}
          </span>
        </div>
      ),
    },
    {
      header: t.pages.clients.email,
      accessor: (item: BusinessUserWithDetails) => item.user.email,
    },
    {
      header: "Role",
      accessor: (item: BusinessUserWithDetails) => (
        <Badge
          variant={item.role === BusinessRole.MANAGER ? "default" : "secondary"}
        >
          {item.role}
        </Badge>
      ),
    },
    {
      header: "",
      accessor: (item: BusinessUserWithDetails) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(item)}>
              {t.common.edit}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(item.id)}
            >
              {t.common.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => {
              setEditData(undefined);
              setDialogOpen(true);
            }}
          >
            {t.pages.employees.addEmployee}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading...
          </div>
        ) : employees.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No employees found"
            description={
              searchTerm
                ? "No employees match your search"
                : "Add your first employee to get started"
            }
          />
        ) : (
          <DataTableWithFilters
            data={employees}
            columns={columns}
            searchableColumns={[]}
            filters={[]}
            pageSize={10}
          />
        )}
      </div>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditData(undefined);
        }}
        onSubmit={handleSubmit}
        editData={editData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the employee from this business. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
