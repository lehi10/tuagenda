"use client";

import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { DataTableWithFilters } from "@/client/components/shared/data-table-with-filters";
import { useTranslation } from "@/client/i18n";
import { useTrpc } from "@/client/lib/trpc";
import { useDebounce } from "@/client/hooks/use-debounce";
import { ClientDetailDialog } from "./client-detail-dialog";

interface ClientRow {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  pictureFullPath: string | null;
  appointmentCount: number;
  lastVisit: Date | null;
}

export function ClientList() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useTrpc.clients.getByBusiness.useQuery({
    search: debouncedSearch || undefined,
    limit: 100,
    offset: 0,
  });

  const clients: ClientRow[] = data?.clients ?? [];

  const getInitials = (firstName: string, lastName: string | null) => {
    return `${firstName[0]}${lastName?.[0] ?? ""}`.toUpperCase();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = [
    {
      header: t.pages.clients.name,
      accessor: (item: ClientRow) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={item.pictureFullPath ?? undefined}
              alt={item.firstName}
            />
            <AvatarFallback>
              {getInitials(item.firstName, item.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {item.firstName} {item.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: t.pages.clients.phone,
      accessor: (item: ClientRow) => item.phone ?? "—",
    },
    {
      header: "Appointments",
      accessor: (item: ClientRow) => (
        <Badge variant="secondary">{item.appointmentCount}</Badge>
      ),
    },
    {
      header: "Last Visit",
      accessor: (item: ClientRow) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(item.lastVisit)}
        </span>
      ),
    },
    {
      header: "",
      accessor: (item: ClientRow) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedClientId(item.id)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Search bar */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      <DataTableWithFilters
        data={clients}
        columns={columns}
        searchableColumns={[]}
        pageSize={10}
      />

      <ClientDetailDialog
        customerId={selectedClientId}
        onClose={() => setSelectedClientId(null)}
      />
    </>
  );
}
