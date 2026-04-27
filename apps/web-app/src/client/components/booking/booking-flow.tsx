"use client";

import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/client/i18n";
import { BookingLeftPanel } from "@/client/components/booking/left-panel/booking-left-panel";
import { MobileStepperBar } from "@/client/components/booking/steppers/mobile-stepper-bar";
import { WhatsAppButton } from "@/client/components/shared/whatsapp-button";
import { BusinessProfilePage } from "@/client/components/booking/business-profile-page";
import { ServiceDetailStep } from "@/client/components/booking/service-detail-step";
import { ProfessionalSelection } from "@/client/components/booking/professional-selection";
import { DateTimeSelection } from "@/client/components/booking/date-time-selection";
import { ClientInfoStep } from "@/client/components/booking/client-info-step";
import { PaymentStep } from "@/client/components/booking/payment-step";
import { ConfirmationStep } from "@/client/components/booking/confirmation-step";
import { BookingOrderSummaryStep } from "@/client/components/booking/booking-order-summary-step";
import { buildStepConfig, getPreviousStep } from "@/client/lib/booking-steps";
import { useBookingFlow } from "@/client/hooks/use-booking-flow";
import { useCreateAppointment } from "@/client/hooks/use-create-appointment";
import { MOCK_BUSINESS_LOCATION } from "@/client/lib/mocks/booking-mocks";
import type {
  BookingService,
  StepConfig,
  StepType,
} from "@/client/types/booking";

interface BusinessProfileData {
  name: string;
  description: string;
  avatar?: string | null;
  email: string;
  phone: string;
  location: string;
  website?: string;
  socialLinks?: Record<string, string>;
}

interface BookingFlowProps {
  businessId: string;
  businessProfile: BusinessProfileData;
  currency: string;
}

export function BookingFlow({
  businessId,
  businessProfile,
  currency,
}: BookingFlowProps) {
  const { t } = useTranslation();
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [showProfilePage, setShowProfilePage] = useState(true);

  // Mirrors bookingData.service so we can compute stepConfig before the hook.
  const [selectedService, setSelectedService] = useState<
    BookingService | undefined
  >();

  // ─── Step config ────────────────────────────────────────────────────────────
  // Single place that decides which steps are shown based on service flags.
  // Add new conditions here when new flags are introduced.
  const stepConfig: StepConfig[] = useMemo(() => {
    const isFree = (selectedService?.price ?? 1) === 0;
    const skipPayment =
      isFree && !(selectedService?.requiresOnlinePayment ?? false);
    return buildStepConfig({ skipPayment });
  }, [selectedService?.price, selectedService?.requiresOnlinePayment]);

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
    goToNextStep,
  } = useBookingFlow({ stepConfig });

  // ─── Appointment creation (used when payment step is skipped) ────────────────
  const { createAppointment } = useCreateAppointment();
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [appointmentError, setAppointmentError] = useState<string | null>(null);

  const createAppointmentAndAdvance = async () => {
    setIsCreatingAppointment(true);
    setAppointmentError(null);
    try {
      const id = await createAppointment(bookingData, businessId);
      setAppointmentId(id);
      goToNextStep();
    } catch (err) {
      setAppointmentError(
        err instanceof Error ? err.message : "Error al crear la reserva"
      );
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const isConfirmation = currentStep === "confirmation";
  const showingDetail = currentStep === "service-detail";
  const paymentEnabled =
    stepConfig.find((s) => s.id === "payment")?.enabled ?? true;

  const showProfile = () => {
    clearBooking();
    setSelectedService(undefined);
    setShowProfilePage(true);
  };

  const handleBack = () => {
    if (showingDetail) {
      showProfile();
      return;
    }
    const prev = getPreviousStep(currentStep, stepConfig);
    if (prev) goToStep(prev);
  };

  const handleEdit = (step: StepType) => {
    if (step === "service-detail") {
      showProfile();
      return;
    }
    goToStep(step);
  };

  // Summary confirms: go to payment if enabled, otherwise create appointment directly.
  const handleSummaryConfirm = () => {
    if (paymentEnabled) {
      goToNextStep();
    } else {
      createAppointmentAndAdvance();
    }
  };

  // ─── Step renderer ──────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {
      case "service-detail":
        return (
          <ServiceDetailStep
            service={bookingData.service!}
            currency={currency}
            onConfirm={goToNextStep}
          />
        );
      case "professional":
        return (
          <ProfessionalSelection
            businessId={businessId}
            onSelect={(p) => updateProfessional({ id: p.id, name: p.name })}
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
        return (
          <ClientInfoStep
            onContinue={updateClientInfo}
            initialData={bookingData.clientInfo}
          />
        );
      case "summary":
        return (
          <BookingOrderSummaryStep
            bookingData={bookingData}
            currency={currency}
            onConfirm={handleSummaryConfirm}
            onEdit={handleEdit}
            paymentEnabled={paymentEnabled}
            isConfirming={isCreatingAppointment}
            confirmError={appointmentError}
          />
        );
      case "payment":
        return (
          <PaymentStep
            bookingData={bookingData}
            businessId={businessId}
            onContinue={(createdAppointmentId) => {
              setAppointmentId(createdAppointmentId);
              updatePaymentMethod("card");
            }}
            isInPerson={!(bookingData.service?.isVirtual ?? false)}
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
              paymentMethod: bookingData.paymentMethod,
              businessLocation: MOCK_BUSINESS_LOCATION,
              currency,
            }}
            onBackToHome={showProfile}
          />
        );
      default:
        return null;
    }
  };

  // ─── Profile page ───────────────────────────────────────────────────────────
  if (showProfilePage) {
    return (
      <div className="min-h-[calc(100vh-56px)]">
        <BusinessProfilePage
          businessId={businessId}
          business={businessProfile}
          currency={currency}
          onServiceSelect={(svc) => {
            setSelectedService(svc);
            updateService(svc);
            setShowProfilePage(false);
            goToStep("service-detail");
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <BookingLeftPanel
        businessProfile={businessProfile}
        currentStep={currentStep}
        stepConfig={stepConfig}
        isStepComplete={isStepComplete}
        showingDetail={showingDetail}
      />

      <div className="flex-1 min-w-0 flex flex-col bg-background">
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

        <div className="flex-1 py-6 px-4 sm:py-8 sm:px-6 mx-auto w-full max-w-2xl">
          {!isConfirmation && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              {t.booking.back}
            </button>
          )}
          {renderStep()}
        </div>

        {showingDetail && businessProfile.phone && (
          <div className="lg:hidden border-t bg-card px-4 py-3">
            <WhatsAppButton phone={businessProfile.phone} justify="center" />
          </div>
        )}
      </div>
    </div>
  );
}
