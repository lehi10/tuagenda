"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/i18n"
import { CreditCard, Smartphone, Store, Check } from "lucide-react"

export type PaymentMethod = "card" | "onsite" | "digital-wallet"

interface PaymentStepProps {
  onContinue: (method: PaymentMethod) => void
  isInPerson?: boolean // To show/hide onsite payment option
}

export function PaymentStep({
  onContinue,
  isInPerson = true,
}: PaymentStepProps) {
  const { t } = useTranslation()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  )

  const paymentMethods = [
    {
      id: "card" as PaymentMethod,
      name: "Tarjeta de Crédito/Débito",
      description: "Pago seguro con tu tarjeta",
      icon: CreditCard,
      available: true,
    },
    {
      id: "onsite" as PaymentMethod,
      name: "Pago en el Local",
      description: "Paga cuando llegues a tu cita",
      icon: Store,
      available: isInPerson,
    },
    {
      id: "digital-wallet" as PaymentMethod,
      name: "Billetera Digital",
      description: "Yape, Plin u otras billeteras",
      icon: Smartphone,
      available: true,
    },
  ]

  const availableMethods = paymentMethods.filter((method) => method.available)

  const handleContinue = () => {
    if (selectedMethod) {
      onContinue(selectedMethod)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Método de Pago</h2>
        <p className="mt-2 text-muted-foreground">
          Selecciona cómo deseas realizar el pago
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableMethods.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id

          return (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <CardContent className="p-6">
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

                  {isSelected && (
                    <div className="mt-4">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selectedMethod}
        className="w-full"
        size="lg"
      >
        Continuar
      </Button>
    </div>
  )
}
