"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "@/i18n"
import { CheckCircle2, Calendar, Clock, User, CreditCard, Mail, MapPin } from "lucide-react"
import { format } from "date-fns"
import { es, enUS } from "date-fns/locale"

interface BookingSummary {
  service: {
    name: string
    duration: number
    price: number
    location: "in-person" | "virtual"
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
  businessLocation?: {
    address: string
    lat?: number
    lng?: number
  }
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

  // Generate Google Maps URL
  const getGoogleMapsUrl = () => {
    if (!bookingSummary.businessLocation) return ""

    const { address, lat, lng } = bookingSummary.businessLocation

    if (lat && lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    }

    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
  }

  const isInPerson = bookingSummary.service.location === "in-person"
  const hasLocation = bookingSummary.businessLocation

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Success Message */}
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
          ¡Reserva Confirmada!
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu cita ha sido agendada exitosamente
        </p>
      </div>

      {/* Two Column Layout: Booking Details + Map/Virtual Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Booking Details */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Detalles de tu Reserva</h3>

              <div className="space-y-3">
                {/* Service */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{bookingSummary.service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {bookingSummary.service.duration} {t.booking.summary.minutes} • $
                      {bookingSummary.service.price}
                    </p>
                  </div>
                </div>

                {/* Professional */}
                {bookingSummary.professional && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          {t.booking.summary.professional}
                        </p>
                        <p className="font-medium text-sm">
                          {bookingSummary.professional.name}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {format(bookingSummary.date, "PPP", { locale: dateLocale })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bookingSummary.timeSlot}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Método de pago</p>
                    <p className="font-medium text-sm">
                      {paymentMethodLabels[bookingSummary.paymentMethod] ||
                        bookingSummary.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Confirmation Notice - Different for virtual vs in-person */}
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-sm text-blue-900 dark:text-blue-100">
                    Confirmación enviada
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {isInPerson ? (
                      <>
                        Hemos enviado un correo con todos los detalles de tu reserva a{" "}
                        <span className="font-medium">
                          {bookingSummary.clientInfo.email}
                        </span>
                      </>
                    ) : (
                      <>
                        Hemos enviado un correo a{" "}
                        <span className="font-medium">
                          {bookingSummary.clientInfo.email}
                        </span>
                        {" "}con la invitación para la videollamada. Puedes aceptar la invitación para que aparezca en tu calendario.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Map (in-person) or Virtual Instructions */}
        {isInPerson && hasLocation ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Ubicación</h3>
                  <p className="text-xs text-muted-foreground">
                    {bookingSummary.businessLocation.address}
                  </p>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(bookingSummary.businessLocation.address)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>

              {/* Directions Link */}
              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <MapPin className="h-4 w-4" />
                Cómo llegar (Google Maps)
              </a>
            </CardContent>
          </Card>
        ) : (
          // Virtual Service Instructions
          <Card className="border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2 text-purple-900 dark:text-purple-100">
                    Información importante para tu cita virtual
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-purple-800 dark:text-purple-200">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
                    <p>
                      <strong>Ingresa puntualmente:</strong> Las citas virtuales no pueden extenderse más allá del tiempo programado.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
                    <p>
                      <strong>Duración:</strong> El profesional estará disponible únicamente durante los {bookingSummary.service.duration} minutos reservados.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
                    <p>
                      <strong>Enlace de videollamada:</strong> Revisa tu correo electrónico para acceder al enlace de la videollamada.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
                    <p>
                      <strong>Calendario:</strong> Acepta la invitación del calendario para recibir recordatorios automáticos.
                    </p>
                  </div>
                </div>

                <Separator className="bg-purple-200 dark:bg-purple-800" />

                <div className="text-xs text-purple-800 dark:text-purple-200">
                  <p className="font-medium mb-1">¿Necesitas reagendar o cancelar?</p>
                  <p>
                    Contáctanos al{" "}
                    <a
                      href={`tel:${bookingSummary.businessLocation?.address || ""}`}
                      className="font-semibold underline"
                    >
                      {/* TODO: Get actual business phone from props */}
                      +51 999 888 777
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onBackToHome} size="lg" className="sm:min-w-[200px]">
          Hacer otra Reserva
        </Button>
        <Button variant="outline" size="lg" className="sm:min-w-[200px]">
          Ver mis Reservas
        </Button>
      </div>

      {/* Additional Info */}
      <div className="rounded-lg border bg-muted/50 p-3 text-center text-xs text-muted-foreground">
        <p>
          ¿Necesitas cancelar o modificar tu cita? Contáctanos al{" "}
          <span className="font-medium">{bookingSummary.clientInfo.phone}</span>
        </p>
      </div>
    </div>
  )
}
