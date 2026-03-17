"use client";

import { useState } from "react";
import { Button } from "@/client/components/ui/button";
import { CreditCard, Smartphone, Store } from "lucide-react";
import { useTranslation } from "@/client/i18n";
import { SelectableCard } from "@/client/components/booking/shared/selectable-card";
import { useTrpc } from "@/client/lib/trpc";
import type { PaymentMethod, BookingData } from "@/client/types/booking";

interface PaymentStepProps {
  bookingData: BookingData;
  businessId: string;
  onContinue: (_appointmentId: string) => void;
  isInPerson?: boolean; // To show/hide onsite payment option
}

export function PaymentStep({
  bookingData,
  businessId,
  onContinue,
  isInPerson = true,
}: PaymentStepProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: "card" as PaymentMethod,
      name: t.booking.payment.methods.card,
      description: t.booking.payment.methods.cardDescription,
      icon: CreditCard,
      available: true,
    },
    {
      id: "onsite" as PaymentMethod,
      name: t.booking.payment.methods.cash,
      description: t.booking.payment.methods.cashDescription,
      icon: Store,
      available: isInPerson,
    },
    {
      id: "digital-wallet" as PaymentMethod,
      name: t.booking.payment.methods.wallet,
      description: t.booking.payment.methods.walletDescription,
      icon: Smartphone,
      available: true,
    },
  ];

  const availableMethods = paymentMethods.filter((method) => method.available);

  const createAppointmentMutation = useTrpc.appointment.create.useMutation();

  const handleContinue = async () => {
    if (!selectedMethod) {
      return;
    }

    // Validate that we have all required booking data
    if (
      !bookingData.service ||
      !bookingData.date ||
      !bookingData.timeSlot ||
      !bookingData.clientInfo
    ) {
      setError("Missing required booking information");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Parse the time slot (format: "HH:mm")
      const [hours, minutes] = bookingData.timeSlot.split(":").map(Number);

      // Create start time by combining date and time slot
      const startTime = new Date(bookingData.date);
      startTime.setHours(hours, minutes, 0, 0);

      // Calculate end time based on service duration
      const endTime = new Date(startTime);
      endTime.setMinutes(
        startTime.getMinutes() + bookingData.service.durationMinutes
      );

      // Create the appointment
      const result = await createAppointmentMutation.mutateAsync({
        customerId: bookingData.clientInfo.userId!,
        businessId: businessId,
        serviceId: bookingData.service.id,
        providerBusinessUserId: bookingData.professional?.id || null,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes: null,
        isGroup: false,
        capacity: null,
      });

      // Continue to confirmation with the appointment ID
      onContinue(result.appointment.id!);
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create appointment. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Standardized */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t.booking.payment.title}
        </h2>
        <p className="text-muted-foreground">{t.booking.payment.description}</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <SelectableCard
              key={method.id}
              isSelected={isSelected}
              onClick={() => setSelectedMethod(method.id)}
              showCheckmark
              contentClassName="p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-8 w-8" />
                </div>

                <h3 className="mb-2 font-semibold">{method.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </SelectableCard>
          );
        })}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selectedMethod || isCreating}
        className="w-full"
        size="lg"
      >
        {isCreating
          ? t.booking.payment.creatingAppointment || "Creating appointment..."
          : t.booking.payment.confirmAndBook || t.booking.summary.continue}
      </Button>
    </div>
  );
}
