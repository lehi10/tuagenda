"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/i18n";
import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { BusinessFormDialog } from "./business-form-dialog";
import { toast } from "sonner";
import { BusinessProps } from "@/core/domain/entities/Business";
import { listBusinesses, deleteBusiness } from "@/server/api/business";
import { useBusiness } from "@/contexts";

const ITEMS_PER_PAGE = 10;

export const BusinessList = forwardRef<{ refresh: () => void }>(
  (props, ref) => {
    const { t } = useTranslation();
    const { refreshBusinesses } = useBusiness();
    const [editingBusiness, setEditingBusiness] =
      useState<BusinessProps | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [businesses, setBusinesses] = useState<BusinessProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
      refresh: fetchBusinesses,
    }));

    // Fetch businesses on mount
    useEffect(() => {
      fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        const result = await listBusinesses();

        if (result.success) {
          setBusinesses(result.businesses);
          // Refresh business switcher in case names changed
          await refreshBusinesses();
        } else {
          toast.error(result.error || "Error al cargar los negocios");
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
        toast.error("Error al cargar los negocios");
      } finally {
        setIsLoading(false);
      }
    };

    const handleEdit = (business: BusinessProps) => {
      setEditingBusiness(business);
      setIsEditDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
      if (!confirm(t.pages.business.actions.confirmDelete)) {
        return;
      }

      try {
        const result = await deleteBusiness({ id });

        if (result.success) {
          toast.success("Negocio eliminado exitosamente");
          fetchBusinesses(); // Refresh the list
          await refreshBusinesses(); // Refresh business switcher
        } else {
          toast.error(result.error || "Error al eliminar el negocio");
        }
      } catch (error) {
        console.error("Error deleting business:", error);
        toast.error("Error al eliminar el negocio");
      }
    };

    const getStatusVariant = (
      status: string
    ): "default" | "secondary" | "destructive" => {
      switch (status) {
        case "active":
          return "default";
        case "inactive":
          return "secondary";
        case "suspended":
          return "destructive";
        default:
          return "secondary";
      }
    };

    // Filter and paginate businesses
    const filteredBusinesses = useMemo(() => {
      return businesses.filter(
        (business) =>
          business.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.phone.includes(searchQuery) ||
          business.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [businesses, searchQuery]);

    const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);

    const paginatedBusinesses = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredBusinesses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredBusinesses, currentPage]);

    // Reset to page 1 when search query changes
    useEffect(() => {
      setCurrentPage(1);
    }, [searchQuery]);

    if (isLoading) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email, teléfono, ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Empty State */}
          {businesses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  {t.pages.business.noBusiness}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.pages.business.createFirst}
                </p>
              </CardContent>
            </Card>
          ) : filteredBusinesses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No se encontraron resultados
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Intenta con otros términos de búsqueda
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Negocio</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedBusinesses.map((business) => (
                        <TableRow key={business.id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage
                                  src={business.logo || undefined}
                                  alt={business.title}
                                />
                                <AvatarFallback className="bg-primary/10">
                                  <Building2 className="h-4 w-4 text-primary" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {business.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  /{business.slug}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm truncate max-w-[200px]">
                                {business.email}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {business.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {business.city}, {business.country}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusVariant(
                                business.status || "active"
                              )}
                              className="text-xs"
                            >
                              {business.status &&
                                t.pages.business.status[business.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(business)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  {t.common.edit}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    business.id && handleDelete(business.id)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {t.common.delete}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredBusinesses.length
                    )}{" "}
                    de {filteredBusinesses.length} resultados
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                        )
                        .map((page, index, array) => {
                          const showEllipsis =
                            index > 0 && array[index - 1] !== page - 1;
                          return (
                            <div key={page} className="flex items-center gap-1">
                              {showEllipsis && (
                                <span className="px-2 text-muted-foreground">
                                  ...
                                </span>
                              )}
                              <Button
                                variant={
                                  currentPage === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-9"
                              >
                                {page}
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {editingBusiness && (
          <BusinessFormDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            business={editingBusiness}
            onClose={() => {
              setEditingBusiness(null);
              setIsEditDialogOpen(false);
            }}
            onSuccess={() => {
              fetchBusinesses(); // Refresh the list after edit
            }}
          />
        )}
      </>
    );
  }
);

BusinessList.displayName = "BusinessList";
