/**
 * Users Table Component
 *
 * Displays a table of users with their information and actions
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { USER_TYPE_CONFIG, USER_STATUS_CONFIG } from "../constants";
import { UserType, UserStatus } from "@/core/domain/entities/User";
import type { UserListItem } from "@/actions/user/get-all-users.action";

interface UsersTableProps {
  users: UserListItem[];
  onEdit: (user: UserListItem) => void;
  onDelete: (user: UserListItem) => void;
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  const formatType = (type: string) => {
    return USER_TYPE_CONFIG[type as UserType]?.label || type;
  };

  const formatStatus = (status: string) => {
    return USER_STATUS_CONFIG[status as UserStatus]?.label || status;
  };

  const getTypeBadgeVariant = (type: string) => {
    return USER_TYPE_CONFIG[type as UserType]?.variant || "outline";
  };

  const getStatusBadgeVariant = (status: string) => {
    return USER_STATUS_CONFIG[status as UserStatus]?.variant || "outline";
  };

  const formatPhone = (phone: string | null, countryCode: string | null) => {
    if (!phone) return null;
    return countryCode ? `+${countryCode} ${phone}` : phone;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.pictureFullPath || undefined} />
                    <AvatarFallback>
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {user.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {formatPhone(user.phone, user.countryCode) || (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getTypeBadgeVariant(user.type)}>
                  {formatType(user.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(user.status)}>
                  {formatStatus(user.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
