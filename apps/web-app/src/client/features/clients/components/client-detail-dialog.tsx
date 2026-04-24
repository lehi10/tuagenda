"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useTrpc } from "@/client/lib/trpc";
import { useTranslation } from "@/client/i18n";
import { Badge } from "@/client/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { Mail, Phone, FileText, Loader2 } from "lucide-react";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  confirmed: "secondary",
  scheduled: "outline",
  cancelled: "destructive",
};

interface ClientDetailDialogProps {
  customerId: string | null;
  onClose: () => void;
}

export function ClientDetailDialog({
  customerId,
  onClose,
}: ClientDetailDialogProps) {
  const { t } = useTranslation();
  const c = t.pages.clients;

  const { data, isLoading, error } = useTrpc.clients.getDetail.useQuery(
    { customerId: customerId! },
    { enabled: !!customerId }
  );

  useEffect(() => {
    if (error) toast.error(c.errorLoadingDetail);
  }, [error, c.errorLoadingDetail]);

  const initials = data
    ? `${data.firstName[0]}${data.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <Dialog open={!!customerId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{c.clientDetail}</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Client header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={data.pictureFullPath ?? undefined}
                  alt={data.firstName}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">
                  {data.firstName} {data.lastName}
                  {data.isGuest && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {c.guest}
                    </Badge>
                  )}
                </h2>
                <div className="space-y-0.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {data.email}
                  </div>
                  {data.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {data.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Note */}
            {data.note && (
              <div className="rounded-md bg-muted p-3 text-sm flex gap-2">
                <FileText className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <span>{data.note}</span>
              </div>
            )}

            {/* Appointment history */}
            <div>
              <h3 className="text-sm font-medium mb-3">
                {c.appointmentHistory} ({data.appointmentCount})
              </h3>
              {data.appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">{c.noAppointments}</p>
              ) : (
                <div className="divide-y rounded-md border text-sm">
                  {data.appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div>
                        <div className="font-medium">{appt.serviceName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(appt.startTime).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                          {appt.providerDisplayName &&
                            ` · ${appt.providerDisplayName}`}
                        </div>
                      </div>
                      <Badge
                        variant={STATUS_VARIANT[appt.status] ?? "outline"}
                        className="capitalize"
                      >
                        {appt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
