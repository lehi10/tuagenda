"use client";

import { useState } from "react";
import { MoreHorizontal, Search, Building2, Users, Phone } from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { Input } from "@/client/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
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
import { DataTableWithFilters } from "@/client/components/shared/data-table-with-filters";
import { useTranslation } from "@/client/i18n";
import { useBusiness } from "@/client/contexts";
import { useTrpc } from "@/client/lib/trpc";
import { BusinessRole } from "@/server/core/domain/entities";
import { BusinessUserWithDetails } from "@/server/core/domain/repositories/IBusinessUserRepository";
import { EmployeeDialog } from "./employee-dialog";
import { EmptyState } from "@/client/components/shared/empty-state";
import { useDebounce } from "@/client/hooks/use-debounce";

export function EmployeeList() {
  const { t } = useTranslation();
  const { currentBusiness } = useBusiness();
  const utils = useTrpc.useUtils();

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

  const { data: employeesData, isLoading } =
    useTrpc.businessUser.getWithDetails.useQuery(
      {
        search: debouncedSearch || undefined,
      },
      {
        enabled: !!currentBusiness?.id,
      }
    );

  const createMutation = useTrpc.businessUser.create.useMutation({
    onSuccess: () => {
      utils.businessUser.getWithDetails.invalidate();
    },
  });

  const updateMutation = useTrpc.businessUser.update.useMutation({
    onSuccess: () => {
      utils.businessUser.getWithDetails.invalidate();
    },
  });

  const deleteMutation = useTrpc.businessUser.delete.useMutation({
    onSuccess: () => {
      utils.businessUser.getWithDetails.invalidate();
    },
  });

  const handleSubmit = async (data: { userId: string; role: BusinessRole }) => {
    if (editData) {
      await updateMutation.mutateAsync({ id: editData.id, role: data.role });
    } else {
      if (!currentBusiness?.id) throw new Error("No business selected");
      await createMutation.mutateAsync({
        userId: data.userId,
        role: data.role,
      });
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
      await deleteMutation.mutateAsync({ id: deleteId });
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
        <div className="flex items-center gap-3 min-w-[180px]">
          <Avatar className="h-9 w-9 ring-2 ring-background">
            <AvatarImage src={item.user.pictureFullPath || undefined} />
            <AvatarFallback className="text-xs font-medium">
              {getInitials(item.user.firstName, item.user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {item.user.firstName} {item.user.lastName}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: t.pages.clients.email,
      accessor: (item: BusinessUserWithDetails) => (
        <span className="text-sm text-muted-foreground">{item.user.email}</span>
      ),
    },
    {
      header: "Teléfono",
      accessor: (item: BusinessUserWithDetails) => (
        <div className="flex items-center gap-2">
          {item.user.phone ? (
            <>
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm">{item.user.phone}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground italic">
              Sin teléfono
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (item: BusinessUserWithDetails) => (
        <Badge
          variant={item.role === BusinessRole.MANAGER ? "default" : "secondary"}
          className="font-medium"
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
