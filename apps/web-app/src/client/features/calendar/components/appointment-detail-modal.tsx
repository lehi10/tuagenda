"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { Badge } from "@/client/components/ui/badge";
import type { Appointment } from "../types/appointment";
import { useBusinessTimezone } from "@/client/contexts/business-timezone-context";
import { formatInTz } from "@/client/lib/timezone-utils";

export interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}

export function AppointmentDetailModal({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailModalProps) {
  const { timezone } = useBusinessTimezone();

  if (!appointment) return null;

  const getStatusVariant = (
    status: Appointment["status"]
  ): "default" | "destructive" | "outline" | "secondary" => {
    const variants: Record<
      Appointment["status"],
      "default" | "destructive" | "secondary"
    > = {
      completed: "default",
      pending: "secondary",
      cancelled: "destructive",
    };
    return variants[status] || "outline";
  };

  const startDate =
    typeof appointment.start === "string"
      ? new Date(appointment.start)
      : appointment.start;
  const endDate =
    typeof appointment.end === "string"
      ? new Date(appointment.end)
      : appointment.end;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{appointment.title}</span>
            <Badge variant={getStatusVariant(appointment.status)}>
              {appointment.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <p className="font-medium">Date & Time</p>
            <p className="text-sm text-muted-foreground">
              {formatInTz(startDate, timezone, "MMMM d, yyyy")} •{" "}
              {formatInTz(startDate, timezone, "h:mm a")} -{" "}
              {formatInTz(endDate, timezone, "h:mm a")}
            </p>
          </div>

          <div>
            <p className="font-medium">Client</p>
            <p className="text-sm text-muted-foreground">
              {appointment.client}
            </p>
          </div>

          <div>
            <p className="font-medium">Service</p>
            <p className="text-sm text-muted-foreground">
              {appointment.service}
            </p>
          </div>

          <div>
            <p className="font-medium">Employee</p>
            <p className="text-sm text-muted-foreground">
              {appointment.employee}
            </p>
          </div>

          {appointment.description && (
            <div className="pt-2 border-t">
              <p className="font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {appointment.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
