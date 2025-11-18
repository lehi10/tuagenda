"use client";

import { useState } from "react";
import { Button } from "@/client/components/ui/button";
import { CreditCard, Smartphone, Store } from "lucide-react";
import { useTranslation } from "@/client/i18n";
import { SelectableCard } from "@/client/components/booking/shared/selectable-card";
import type { PaymentMethod } from "@/client/types/booking";

interface PaymentStepProps {
  onContinue: (_method: PaymentMethod) => void;
  isInPerson?: boolean; // To show/hide onsite payment option
}

export function PaymentStep({
  onContinue,
  isInPerson = true,
}: PaymentStepProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );

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

  const handleContinue = () => {
    if (selectedMethod) {
      onContinue(selectedMethod);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t.booking.payment.title}</h2>
        <p className="mt-2 text-muted-foreground">
          {t.booking.payment.description}
        </p>
      </div>

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
        disabled={!selectedMethod}
        className="w-full"
        size="lg"
      >
        {t.booking.summary.continue}
      </Button>
    </div>
  );
}
