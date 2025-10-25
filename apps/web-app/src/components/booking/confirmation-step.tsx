"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "@/i18n"
import { CheckCircle2, Calendar, Clock, User, CreditCard, Mail } from "lucide-react"
import { format } from "date-fns"
import { es, enUS } from "date-fns/locale"

interface BookingSummary {
  service: {
    name: string
    duration: number
    price: number
  }
  professional?: {
    name: string
  }
  date: Date
  timeSlot: string
  clientInfo: {
    fullName: string
    email: string
    phone: string
  }
  paymentMethod: string
}

interface ConfirmationStepProps {
  bookingSummary: BookingSummary
  onBackToHome: () => void
}

export function ConfirmationStep({
  bookingSummary,
  onBackToHome,
}: ConfirmationStepProps) {
  const { t, locale } = useTranslation()
  const dateLocale = locale === "es" ? es : enUS

  const paymentMethodLabels: Record<string, string> = {
    card: "Tarjeta de Crédito/Débito",
    onsite: "Pago en el Local",
    "digital-wallet": "Billetera Digital (Yape/Plin)",
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Success Message */}
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
          ¡Reserva Confirmada!
        </h2>
        <p className="mt-2 text-muted-foreground">
          Tu cita ha sido agendada exitosamente
        </p>
      </div>

      {/* Booking Details Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Detalles de tu Reserva</h3>

            <div className="space-y-4">
              {/* Service */}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{bookingSummary.service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {bookingSummary.service.duration} {t.booking.summary.minutes} • $
                    {bookingSummary.service.price}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Professional */}
              {bookingSummary.professional && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {t.booking.summary.professional}
                      </p>
                      <p className="font-medium">
                        {bookingSummary.professional.name}
                      </p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {format(bookingSummary.date, "PPP", { locale: dateLocale })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bookingSummary.timeSlot}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Payment Method */}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Método de pago</p>
                  <p className="font-medium">
                    {paymentMethodLabels[bookingSummary.paymentMethod] ||
                      bookingSummary.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Confirmation Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Confirmación enviada
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Hemos enviado un correo con todos los detalles de tu reserva a{" "}
                <span className="font-medium">
                  {bookingSummary.clientInfo.email}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onBackToHome} className="flex-1" size="lg">
          Hacer otra Reserva
        </Button>
        <Button variant="outline" className="flex-1" size="lg">
          Ver mis Reservas
        </Button>
      </div>

      {/* Additional Info */}
      <div className="rounded-lg border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
        <p>
          ¿Necesitas cancelar o modificar tu cita? Contáctanos al{" "}
          <span className="font-medium">{bookingSummary.clientInfo.phone}</span>
        </p>
      </div>
    </div>
  )
}
