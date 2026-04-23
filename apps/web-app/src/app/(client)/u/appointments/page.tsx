"use client";

import { useState } from "react";
import { Button } from "@/client/components/ui/button";
import { Card } from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
import {
  Calendar,
  Clock,
  MapPin,
  X,
  CalendarClock,
  Phone,
  Mail,
  Globe,
  Info,
} from "lucide-react";
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
import { useTrpc } from "@/client/lib/trpc";
import { formatCurrency } from "@/client/lib/currency-utils";
import { Skeleton } from "@/client/components/ui/skeleton";
import type { Appointment } from "@/server/core/domain/entities/Appointment";

export default function AppointmentsPage() {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const { data: upcomingAppointments, isLoading: isLoadingUpcoming } =
    useTrpc.appointment.getUpcomingAppointments.useQuery();
  const { data: pastAppointments, isLoading: isLoadingPast } =
    useTrpc.appointment.getPastAppointments.useQuery();

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    console.log("Cancelling appointment:", selectedAppointment?.id);
    setCancelDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleReschedule = (appointment: Appointment) => {
    console.log("Rescheduling appointment:", appointment.id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Confirmada</Badge>
        );
      case "scheduled":
        return <Badge variant="secondary">Agendada</Badge>;
      case "completed":
        return <Badge variant="outline">Completada</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };


  const getProviderName = (appointment: Appointment) => {
    if (appointment.providerBusinessUser?.displayName) {
      return appointment.providerBusinessUser.displayName;
    }
    if (appointment.providerBusinessUser?.user) {
      const { firstName, lastName } = appointment.providerBusinessUser.user;
      return `${firstName}${lastName ? " " + lastName : ""}`;
    }
    return "No asignado";
  };

  const getProviderInitials = (appointment: Appointment) => {
    if (appointment.providerBusinessUser?.user) {
      const { firstName, lastName } = appointment.providerBusinessUser.user;
      return `${firstName[0]}${lastName?.[0] || ""}`.toUpperCase();
    }
    return "NA";
  };

  const getBusinessInitials = (businessTitle: string) => {
    const words = businessTitle.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return businessTitle.substring(0, 2).toUpperCase();
  };

  const AppointmentCard = ({
    appointment,
    showActions = true,
  }: {
    appointment: Appointment;
    showActions?: boolean;
  }) => (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Left: Date Badge */}
        <div className="flex flex-col items-center justify-start pt-1 min-w-[60px]">
          <div className="text-2xl font-bold">
            {new Date(appointment.startTime).getDate()}
          </div>
          <div className="text-xs text-muted-foreground uppercase">
            {new Date(appointment.startTime).toLocaleDateString("es-ES", {
              month: "short",
            })}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatTime(appointment.startTime)}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-border" />

        {/* Center: Service & Provider Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1">
                {appointment.service?.name || "Servicio"}
              </h3>
              {appointment.service?.description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                  {appointment.service.description}
                </p>
              )}
            </div>
            {getStatusBadge(appointment.status)}
          </div>

          {/* Provider */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  appointment.providerBusinessUser?.user?.pictureFullPath || ""
                }
                alt={getProviderName(appointment)}
              />
              <AvatarFallback className="text-xs">
                {getProviderInitials(appointment)}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <span className="text-muted-foreground">con </span>
              <span className="font-medium">
                {getProviderName(appointment)}
              </span>
            </div>
          </div>

          {/* Business Info */}
          {appointment.business && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={appointment.business.logo || ""}
                    alt={appointment.business.title}
                  />
                  <AvatarFallback className="text-[10px]">
                    {getBusinessInitials(appointment.business.title)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {appointment.business.title}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {appointment.business.city}
                  </p>
                </div>
              </div>

              {/* Business Info Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Info className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={appointment.business.logo || ""}
                          alt={appointment.business.title}
                        />
                        <AvatarFallback>
                          {getBusinessInitials(appointment.business.title)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">
                          {appointment.business.title}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-start gap-1 mt-1">
                          <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                          <span>
                            {appointment.business.address},{" "}
                            {appointment.business.city}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm border-t pt-3">
                      {appointment.business.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4 shrink-0" />
                          <span>{appointment.business.phone}</span>
                        </div>
                      )}
                      {appointment.business.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {appointment.business.email}
                          </span>
                        </div>
                      )}
                      {appointment.business.website && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Globe className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {appointment.business.website}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Details */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {appointment.service?.durationMinutes &&
                formatDuration(appointment.service.durationMinutes)}
            </div>
            <div className="font-semibold text-foreground">
              {appointment.service?.price &&
                formatCurrency(
                  appointment.service.price,
                  appointment.business?.currency ?? "USD"
                )}
            </div>
          </div>

          {/* Actions */}
          {showActions &&
            (appointment.status === "confirmed" ||
              appointment.status === "scheduled") && (
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReschedule(appointment)}
                >
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Reprogramar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelClick(appointment)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            )}
        </div>
      </div>
    </Card>
  );

  const LoadingState = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center min-w-[60px]">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-10 mt-1" />
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <Card className="p-8">
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </Card>
  );

  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Mis Citas</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Gestiona tus citas programadas y revisa tu historial
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Próximas ({upcomingAppointments?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="past">
            Anteriores ({pastAppointments?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {isLoadingUpcoming ? (
            <LoadingState />
          ) : upcomingAppointments && upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id!}
                appointment={appointment}
                showActions={true}
              />
            ))
          ) : (
            <EmptyState message="No tienes citas próximas programadas" />
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4 space-y-3">
          {isLoadingPast ? (
            <LoadingState />
          ) : pastAppointments && pastAppointments.length > 0 ? (
            pastAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id!}
                appointment={appointment}
                showActions={false}
              />
            ))
          ) : (
            <EmptyState message="No tienes citas anteriores" />
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar cita?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cancelar tu cita de{" "}
              <strong>{selectedAppointment?.service?.name}</strong> el{" "}
              <strong>
                {selectedAppointment &&
                  formatDate(selectedAppointment.startTime)}{" "}
                a las{" "}
                {selectedAppointment &&
                  formatTime(selectedAppointment.startTime)}
              </strong>
              ? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener cita</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, cancelar cita
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
