"use client";

import { useTranslation } from "@/i18n";
import { AppointmentStats } from "@/features/appointments/components/appointment-stats";
import { AppointmentList } from "@/features/appointments/components/appointment-list";
import { Button } from "@/components/ui/button";

export default function AppointmentsPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.pages.appointments.title}</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all appointments
          </p>
        </div>
        <Button>{t.pages.appointments.newAppointment}</Button>
      </div>
      <AppointmentStats />
      <AppointmentList />
    </div>
  );
}
