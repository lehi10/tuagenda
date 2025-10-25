"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { useTranslation } from "@/i18n";

interface Appointment {
  id: string;
  time: string;
  client: string;
  service: string;
  employee: string;
  status: "pending" | "completed" | "cancelled";
}

interface DayAppointmentsProps {
  date?: Date;
}

export function DayAppointments({ date }: DayAppointmentsProps) {
  const { t } = useTranslation();

  const appointments: Appointment[] = [
    {
      id: "1",
      time: "09:00 AM",
      client: "John Doe",
      service: "Haircut",
      employee: "Sarah Johnson",
      status: "pending",
    },
    {
      id: "2",
      time: "10:30 AM",
      client: "Jane Smith",
      service: "Manicure",
      employee: "Emily Davis",
      status: "pending",
    },
    {
      id: "3",
      time: "02:00 PM",
      client: "Bob Wilson",
      service: "Massage",
      employee: "Mike Brown",
      status: "completed",
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {date ? formatDate(date) : t.pages.calendar.today}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No appointments scheduled
          </p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{appointment.time}</span>
                </div>
                <Badge variant={getStatusVariant(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span>{appointment.client}</span>
                </div>
                <div className="text-muted-foreground">
                  {appointment.service} • {appointment.employee}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
