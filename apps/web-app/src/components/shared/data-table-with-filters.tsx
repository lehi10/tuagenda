"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Column<T> {
  header: string;
  accessor: keyof T | ((_item: T) => React.ReactNode);
  className?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  placeholder: string;
  options: FilterOption[];
  accessor: string;
}

interface DataTableWithFiltersProps<T> {
  data: T[];
  columns: Column<T>[];
  searchableColumns?: (keyof T)[];
  filters?: FilterConfig[];
  pageSize?: number;
}

export function DataTableWithFilters<T extends Record<string, any>>({
  data,
  columns,
  searchableColumns = [],
  filters = [],
  pageSize = 10,
}: DataTableWithFiltersProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});

  // Filtrar datos
  const filteredData = useMemo(() => {
    let result = [...data];

    // Filtro de búsqueda
    if (searchQuery && searchableColumns.length > 0) {
      result = result.filter((item) =>
        searchableColumns.some((column) => {
          const value = item[column];
          return String(value)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        })
      );
    }

    // Filtros por columnas
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        result = result.filter((item) => String(item[key]) === value);
      }
    });

    return result;
  }, [data, searchQuery, searchableColumns, selectedFilters]);

  // Paginación
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Resetear a página 1 cuando cambian los filtros
  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFilters({});
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery || Object.values(selectedFilters).some((v) => v && v !== "all");

  return (
    <div className="space-y-4">
      {/* Barra de filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Búsqueda */}
        {searchableColumns.length > 0 && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                onClick={() => handleSearchChange("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <Select
              key={filter.accessor}
              value={selectedFilters[filter.accessor] || "all"}
              onValueChange={(value) =>
                handleFilterChange(filter.accessor, value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} size="sm">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedData.length} of {filteredData.length} results
        {filteredData.length !== data.length &&
          ` (filtered from ${data.length} total)`}
      </div>

      {/* Tabla */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {typeof column.accessor === "function"
                        ? column.accessor(item)
                        : String(item[column.accessor])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Mostrar primera página, última página, y páginas cercanas a la actual
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              // Mostrar ellipsis
              if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
