"use client";

import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { BusinessProfilePage } from "@/client/components/booking/business-profile-page";
import { ServiceSelection } from "@/client/components/booking/service-selection";
import { ServiceDetailStep } from "@/client/components/booking/service-detail-step";
import { ProfessionalSelection } from "@/client/components/booking/professional-selection";
import { DateTimeSelection } from "@/client/components/booking/date-time-selection";
import { ClientInfoStep } from "@/client/components/booking/client-info-step";
import { PaymentStep } from "@/client/components/booking/payment-step";
import { ConfirmationStep } from "@/client/components/booking/confirmation-step";
import { defaultStepConfig, getEnabledSteps, getPreviousStep } from "@/client/lib/booking-steps";
import { useBookingFlow } from "@/client/hooks/use-booking-flow";
import { MOCK_BUSINESS_LOCATION } from "@/client/lib/mocks/booking-mocks";
import { cn } from "@/client/lib/utils";
import { formatPrice } from "@/client/lib/booking-utils";
import type { BookingService, StepConfig, StepType } from "@/client/types/booking";

interface BusinessProfileData {
  name: string;
  description: string;
  avatar?: string | null;
  email: string;
  phone: string;
  location: string;
  website?: string;
}

interface BookingFlowProps {
  businessId: string;
  businessProfile: BusinessProfileData;
}

const STEP_LABELS: Record<StepType, string> = {
  service: "Servicio",
  professional: "Profesional",
  date: "Fecha y hora",
  time: "Horario",
  "client-info": "Tu cuenta",
  payment: "Confirmar",
  confirmation: "Listo",
};

const STEPPER_STEPS: StepType[] = [
  "service",
  "professional",
  "date",
  "client-info",
  "payment",
];

// ── Vertical stepper (left panel, desktop) ─────────────────────
function VerticalStepper({
  currentStep,
  stepConfig,
  isStepComplete,
  showingDetail,
}: {
  currentStep: StepType;
  stepConfig: StepConfig[];
  isStepComplete: (step: StepType) => boolean;
  showingDetail: boolean;
}) {
  const enabledSteps = getEnabledSteps(stepConfig).filter((s) =>
    STEPPER_STEPS.includes(s.id)
  );
  const currentIndex = enabledSteps.findIndex((s) => s.id === currentStep);
  // When showing detail, treat service as the active step visually
  const activeStepId = showingDetail ? "service" : currentStep;

  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Tu progreso
      </p>
      {enabledSteps.map((step, i) => {
        const isDone = isStepComplete(step.id) && step.id !== activeStepId;
        const isActive = step.id === activeStepId;
        return (
          <div key={step.id} className="flex gap-3 items-start">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200",
                  isDone
                    ? "bg-green-500 text-white"
                    : isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {i < enabledSteps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-7 my-0.5 rounded-full transition-colors duration-200",
                    i < currentIndex ? "bg-green-500" : "bg-border"
                  )}
                />
              )}
            </div>
            <div
              className={cn(
                "pb-5",
                i === enabledSteps.length - 1 && "pb-0"
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium transition-colors",
                  isDone
                    ? "text-green-600"
                    : isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                )}
              >
                {STEP_LABELS[step.id]}
              </p>
              {isActive && (
                <p className="text-xs text-primary mt-0.5">En curso</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Mobile horizontal stepper ───────────────────────────────────
function MobileStepperBar({
  currentStep,
  stepConfig,
  isStepComplete,
  showingDetail,
}: {
  currentStep: StepType;
  stepConfig: StepConfig[];
  isStepComplete: (step: StepType) => boolean;
  showingDetail: boolean;
}) {
  const enabledSteps = getEnabledSteps(stepConfig).filter((s) =>
    STEPPER_STEPS.includes(s.id)
  );
  const activeStepId = showingDetail ? "service" : currentStep;
  const currentIndex = enabledSteps.findIndex((s) => s.id === activeStepId);

  return (
    <div className="flex items-center gap-1 px-4 py-3 border-b bg-card overflow-x-auto">
      {enabledSteps.map((step, i) => {
        const isDone = isStepComplete(step.id) && step.id !== activeStepId;
        const isActive = step.id === activeStepId;
        return (
          <div key={step.id} className="flex items-center gap-1 shrink-0">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                isDone
                  ? "bg-green-500 text-white"
                  : isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {isDone ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
            </div>
            {isActive && (
              <span className="text-xs font-semibold text-primary whitespace-nowrap">
                {STEP_LABELS[step.id]}
              </span>
            )}
            {i < enabledSteps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-4 rounded-full shrink-0",
                  i < currentIndex ? "bg-green-500" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Left panel booking summary ──────────────────────────────────
function LeftPanelSummary({
  bookingData,
}: {
  bookingData: { service?: BookingService; professional?: { name: string }; date?: Date; timeSlot?: string };
}) {
  if (!bookingData.service && !bookingData.professional && !bookingData.date && !bookingData.timeSlot) {
    return null;
  }
  return (
    <div className="p-5 flex-1">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Resumen
      </p>
      <div className="space-y-2.5">
        {bookingData.service && (
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-sm">
              📋
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight line-clamp-2">
                {bookingData.service.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {bookingData.service.durationMinutes} min
              </p>
            </div>
            <span className="text-sm font-bold text-primary shrink-0">
              {formatPrice(bookingData.service.price)}
            </span>
          </div>
        )}
        {bookingData.professional && (
          <div className="rounded-xl bg-muted/60 px-3 py-2.5 flex gap-2 items-center">
            <span className="text-sm">👤</span>
            <p className="text-sm font-semibold">{bookingData.professional.name}</p>
          </div>
        )}
        {(bookingData.date || bookingData.timeSlot) && (
          <div className="rounded-xl bg-muted/60 px-3 py-2.5">
            <p className="text-xs text-muted-foreground mb-0.5">Fecha y hora</p>
            {bookingData.date && (
              <p className="text-sm font-semibold">
                {bookingData.date.toLocaleDateString("es", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            )}
            {bookingData.timeSlot && (
              <p className="text-sm font-semibold text-primary">
                {bookingData.timeSlot}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────
export function BookingFlow({ businessId, businessProfile }: BookingFlowProps) {
  const stepConfig: StepConfig[] = defaultStepConfig;
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  // Profile page: shown first before the booking flow
  const [showProfilePage, setShowProfilePage] = useState(true);
  const [cameFromProfile, setCameFromProfile] = useState(false);
  // Service detail state: null = not showing detail
  const [serviceForDetail, setServiceForDetail] = useState<BookingService | null>(null);

  const {
    bookingData,
    currentStep,
    updateService,
    updateProfessional,
    updateDate,
    updateTimeSlot,
    updateClientInfo,
    updatePaymentMethod,
    clearBooking,
    isStepComplete,
    goToStep,
  } = useBookingFlow({ stepConfig });

  const isConfirmation = currentStep === "confirmation";
  const showingDetail = serviceForDetail !== null && currentStep === "service";

  // ── Back to home (profile page) handler ──────────────────────
  const handleBackToHome = () => {
    clearBooking();
    setServiceForDetail(null);
    setCameFromProfile(false);
    setShowProfilePage(true);
  };

  // ── Unified back handler for all steps ───────────────────────
  const handleBack = () => {
    if (showingDetail) {
      setServiceForDetail(null);
      if (cameFromProfile) {
        setCameFromProfile(false);
        setShowProfilePage(true);
      }
      return;
    }
    if (currentStep === "service") {
      handleBackToHome();
      return;
    }
    const prev = getPreviousStep(currentStep, stepConfig);
    if (prev) goToStep(prev);
  };

  const showBackButton = !isConfirmation;

  const renderStep = () => {
    // Service detail screen (UI step between service list and professional)
    if (showingDetail && serviceForDetail) {
      return (
        <ServiceDetailStep
          service={serviceForDetail}
          onConfirm={(svc) => {
            setServiceForDetail(null);
            setCameFromProfile(false);
            updateService(svc); // advances to next real step
          }}
          onBack={() => {
            setServiceForDetail(null);
            if (cameFromProfile) {
              setCameFromProfile(false);
              setShowProfilePage(true);
            }
          }}
        />
      );
    }

    switch (currentStep) {
      case "service":
        return (
          <ServiceSelection
            businessId={businessId}
            onSelect={(svc) => setServiceForDetail(svc)} // show detail first
            selectedServiceId={bookingData.service?.id}
          />
        );
      case "professional":
        return (
          <ProfessionalSelection
            businessId={businessId}
            onSelect={(professional) =>
              updateProfessional({ id: professional.id, name: professional.name })
            }
            selectedProfessionalId={bookingData.professional?.id}
            serviceId={bookingData.service?.id}
          />
        );
      case "date":
        return (
          <DateTimeSelection
            professionalId={bookingData.professional?.id ?? ""}
            serviceId={bookingData.service?.id ?? ""}
            selectedDate={bookingData.date}
            selectedSlot={bookingData.timeSlot}
            onDateChange={updateDate}
            onSlotSelect={updateTimeSlot}
          />
        );
      case "client-info":
        return <ClientInfoStep onContinue={updateClientInfo} />;
      case "payment":
        return (
          <PaymentStep
            bookingData={bookingData}
            businessId={businessId}
            onContinue={(createdAppointmentId) => {
              setAppointmentId(createdAppointmentId);
              updatePaymentMethod("card");
            }}
            isInPerson={true}
          />
        );
      case "confirmation":
        return (
          <ConfirmationStep
            appointmentId={appointmentId}
            bookingSummary={{
              service: bookingData.service!,
              professional: bookingData.professional,
              date: bookingData.date!,
              timeSlot: bookingData.timeSlot!,
              clientInfo: bookingData.clientInfo!,
              paymentMethod: bookingData.paymentMethod!,
              businessLocation: MOCK_BUSINESS_LOCATION,
            }}
            onBackToHome={handleBackToHome}
          />
        );
      default:
        return null;
    }
  };

  // ── Profile page (initial landing) ────────────────────────────
  if (showProfilePage) {
    return (
      <div className="min-h-[calc(100vh-56px)]">
        <BusinessProfilePage
          businessId={businessId}
          business={businessProfile}
          onServiceSelect={(svc) => {
            setShowProfilePage(false);
            setServiceForDetail(svc);
            setCameFromProfile(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)]">

      {/* ── Left panel (desktop only, hidden on confirmation) ───── */}
      {!isConfirmation && (
        <aside className="hidden lg:flex w-[300px] xl:w-[320px] flex-shrink-0 flex-col border-r bg-card sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">

          {/* Business card */}
          <div className="p-5 border-b">
            <div className="flex gap-3 items-center mb-4">
              <Avatar className="h-12 w-12 rounded-xl shrink-0 ring-1 ring-primary/10">
                <AvatarImage
                  src={businessProfile.avatar || ""}
                  alt={businessProfile.name}
                />
                <AvatarFallback className="rounded-xl text-sm font-semibold bg-primary/10 text-primary">
                  {businessProfile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{businessProfile.name}</p>
                {businessProfile.location && (
                  <p className="text-xs text-muted-foreground truncate">
                    📍 {businessProfile.location}
                  </p>
                )}
              </div>
            </div>
            {businessProfile.phone && (
              <a
                href={`https://wa.me/${businessProfile.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full rounded-xl border border-green-200 bg-green-50 p-2.5 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="#25D366"
                  className="shrink-0"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.872L.057 23.25a.75.75 0 00.916.916l5.377-1.487A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.7-.5-5.253-1.373l-.369-.214-3.843 1.063 1.063-3.843-.214-.369A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                Hablar por WhatsApp
              </a>
            )}
          </div>

          {/* Vertical stepper */}
          <div className="p-5 border-b">
            <VerticalStepper
              currentStep={currentStep}
              stepConfig={stepConfig}
              isStepComplete={isStepComplete}
              showingDetail={showingDetail}
            />
          </div>

          {/* Booking summary */}
          <LeftPanelSummary bookingData={bookingData} />
        </aside>
      )}

      {/* ── Right panel ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col bg-background">

        {/* Mobile stepper bar */}
        {!isConfirmation && (
          <div className="lg:hidden">
            <MobileStepperBar
              currentStep={currentStep}
              stepConfig={stepConfig}
              isStepComplete={isStepComplete}
              showingDetail={showingDetail}
            />
          </div>
        )}

        {/* Step content */}
        <div
          className={cn(
            "flex-1 py-6 px-4 sm:py-8 sm:px-6",
            !isConfirmation && "mx-auto w-full max-w-2xl"
          )}
        >
          {showBackButton && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Atrás
            </button>
          )}
          {renderStep()}
        </div>

        {/* Mobile bottom WhatsApp button (only on service/detail steps) */}
        {(currentStep === "service" || showingDetail) &&
          businessProfile.phone && (
            <div className="lg:hidden border-t bg-card px-4 py-3">
              <a
                href={`https://wa.me/${businessProfile.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-green-200 bg-green-50 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.872L.057 23.25a.75.75 0 00.916.916l5.377-1.487A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.7-.5-5.253-1.373l-.369-.214-3.843 1.063 1.063-3.843-.214-.369A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                Hablar por WhatsApp
              </a>
            </div>
          )}
      </div>
    </div>
  );
}
