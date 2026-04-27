"use client";

import { useState } from "react";
import { Button } from "@/client/components/ui/button";
import { CreditCard, Smartphone, Store, Check } from "lucide-react";
import { useTranslation } from "@/client/i18n";
import { useCreateAppointment } from "@/client/hooks/use-create-appointment";
import { cn } from "@/client/lib/utils";
import type { PaymentMethod, BookingData } from "@/client/types/booking";

interface PaymentStepProps {
  bookingData: BookingData;
  businessId: string;
  onContinue: (_appointmentId: string) => void;
  isInPerson?: boolean;
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
  const { createAppointment } = useCreateAppointment();

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

  const handleContinue = async () => {
    if (!selectedMethod) return;

    setIsCreating(true);
    setError(null);
    try {
      const id = await createAppointment(bookingData, businessId);
      onContinue(id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la reserva"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t.booking.payment.title}
        </h2>
        <p className="text-muted-foreground">{t.booking.payment.description}</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Payment methods — list style */}
      <div className="space-y-2.5">
        {availableMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={cn(
                "w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-all",
                "hover:shadow-sm active:scale-[0.99]",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{method.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {method.description}
                </p>
              </div>

              {/* Radio */}
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && (
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirmation note */}
      <div className="rounded-xl bg-muted/50 p-3.5 text-sm text-muted-foreground">
        📲 {t.booking.payment.whatsappConfirmation}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selectedMethod || isCreating}
        className="w-full h-12 rounded-xl font-semibold"
        size="lg"
      >
        {isCreating
          ? t.booking.payment.creatingAppointment
          : selectedMethod === "onsite"
            ? t.booking.payment.confirmOnsite
            : t.booking.payment.confirmAndBook}
      </Button>
    </div>
  );
}
