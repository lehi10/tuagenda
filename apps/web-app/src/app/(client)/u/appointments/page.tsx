"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, User, X, CalendarClock } from "lucide-react";
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

// Mock data for appointments
const mockAppointments = {
  upcoming: [
    {
      id: "1",
      service: "Corte de Cabello",
      provider: "Juan Pérez",
      date: "2025-11-05",
      time: "10:00 AM",
      duration: "30 min",
      location: "Barbería Central",
      address: "Av. Principal 123",
      status: "confirmed",
      price: "$15.00",
    },
    {
      id: "2",
      service: "Masaje Relajante",
      provider: "María González",
      date: "2025-11-08",
      time: "2:00 PM",
      duration: "60 min",
      location: "Spa Wellness",
      address: "Calle Paz 456",
      status: "confirmed",
      price: "$45.00",
    },
    {
      id: "3",
      service: "Consulta Dental",
      provider: "Dr. Carlos Ruiz",
      date: "2025-11-12",
      time: "9:30 AM",
      duration: "45 min",
      location: "Clínica Dental",
      address: "Centro Médico, Piso 3",
      status: "pending",
      price: "$60.00",
    },
  ],
  past: [
    {
      id: "4",
      service: "Corte de Cabello",
      provider: "Juan Pérez",
      date: "2025-10-15",
      time: "11:00 AM",
      duration: "30 min",
      location: "Barbería Central",
      address: "Av. Principal 123",
      status: "completed",
      price: "$15.00",
    },
    {
      id: "5",
      service: "Limpieza Facial",
      provider: "Ana Martínez",
      date: "2025-10-08",
      time: "3:00 PM",
      duration: "90 min",
      location: "Estética Bella",
      address: "Plaza Shopping, Local 12",
      status: "completed",
      price: "$35.00",
    },
    {
      id: "6",
      service: "Masaje Relajante",
      provider: "María González",
      date: "2025-09-20",
      time: "4:00 PM",
      duration: "60 min",
      location: "Spa Wellness",
      address: "Calle Paz 456",
      status: "cancelled",
      price: "$45.00",
    },
  ],
};

type Appointment = (typeof mockAppointments.upcoming)[0];

export default function AppointmentsPage() {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    // TODO: Implement cancel logic
    console.log("Cancelling appointment:", selectedAppointment?.id);
    setCancelDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleReschedule = (appointment: Appointment) => {
    // TODO: Implement reschedule logic
    console.log("Rescheduling appointment:", appointment.id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmada</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "completed":
        return <Badge variant="outline">Completada</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const AppointmentCard = ({
    appointment,
    showActions = true,
  }: {
    appointment: Appointment;
    showActions?: boolean;
  }) => (
    <Card className="overflow-hidden">
      <div className="px-3 py-2">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold leading-tight mb-0.5">
              {appointment.service}
            </h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3 shrink-0" />
              <span className="truncate">{appointment.provider}</span>
            </p>
          </div>
          <div className="shrink-0">{getStatusBadge(appointment.status)}</div>
        </div>

        <div className="space-y-0.5 text-xs mb-1.5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>
              {new Date(appointment.date).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            <span>
              {appointment.time} • {appointment.duration}
            </span>
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-medium text-foreground text-xs block">
                {appointment.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1.5 border-t">
          <span className="text-sm font-semibold">{appointment.price}</span>
          {showActions && appointment.status === "confirmed" && (
            <div className="flex gap-1.5 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReschedule(appointment)}
                className="flex-1 sm:flex-initial h-7 text-xs px-2"
              >
                <CalendarClock className="mr-1 h-3 w-3" />
                Reprogramar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelClick(appointment)}
                className="flex-1 sm:flex-initial h-7 text-xs px-2"
              >
                <X className="mr-1 h-3 w-3" />
                Cancelar
              </Button>
            </div>
          )}
          {showActions && appointment.status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancelClick(appointment)}
              className="w-full sm:w-auto h-7 text-xs px-2"
            >
              <X className="mr-1 h-3 w-3" />
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-4 space-y-4 sm:p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Mis Citas</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tus citas programadas y revisa tu historial
        </p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Próximas ({mockAppointments.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Anteriores ({mockAppointments.past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {mockAppointments.upcoming.length > 0 ? (
            <div className="space-y-3">
              {mockAppointments.upcoming.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No tienes citas próximas
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {mockAppointments.past.length > 0 ? (
            <div className="space-y-3">
              {mockAppointments.past.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No tienes citas anteriores
                </p>
              </CardContent>
            </Card>
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
              <strong>{selectedAppointment?.service}</strong> el{" "}
              <strong>
                {selectedAppointment?.date} a las {selectedAppointment?.time}
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
