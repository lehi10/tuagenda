/**
 * Users Table Component
 *
 * Displays a table of users with their information and actions
 */

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { USER_TYPE_CONFIG, USER_STATUS_CONFIG } from "../constants";
import { UserType, UserStatus } from "@/server/core/domain/entities/User";
import type { UserProps } from "@/server/core/domain/entities/User";

interface UsersTableProps {
  users: UserProps[];
  onEdit: (user: UserProps) => void;
  onDelete: (user: UserProps) => void;
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  const formatType = (type: string | undefined) => {
    if (!type) return "Unknown";
    return USER_TYPE_CONFIG[type as UserType]?.label || type;
  };

  const formatStatus = (status: string | undefined) => {
    if (!status) return "Unknown";
    return USER_STATUS_CONFIG[status as UserStatus]?.label || status;
  };

  const getTypeBadgeVariant = (type: string | undefined) => {
    if (!type) return "outline";
    return USER_TYPE_CONFIG[type as UserType]?.variant || "outline";
  };

  const getStatusBadgeVariant = (status: string | undefined) => {
    if (!status) return "outline";
    return USER_STATUS_CONFIG[status as UserStatus]?.variant || "outline";
  };

  const formatPhone = (
    phone: string | null | undefined,
    countryCode: string | null | undefined
  ) => {
    if (!phone) return null;
    return countryCode ? `${countryCode} ${phone}` : phone;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-muted/50">
            <TableHead className="font-semibold">User</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Joined</TableHead>
            <TableHead className="w-[70px] text-right font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-background">
                    <AvatarImage src={user.pictureFullPath || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      ID: {user.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                {formatPhone(user.phone, user.countryCode) ? (
                  <span className="text-sm font-mono">
                    {formatPhone(user.phone, user.countryCode)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Not provided
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={getTypeBadgeVariant(user.type)}
                  className="font-medium"
                >
                  {formatType(user.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getStatusBadgeVariant(user.status)}
                  className="font-medium"
                >
                  {formatStatus(user.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-muted transition-colors"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel className="text-xs font-semibold">
                      Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onEdit(user)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
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
