"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { BookingLeftPanel } from "@/client/components/booking/left-panel/booking-left-panel";
import { MobileStepperBar } from "@/client/components/booking/steppers/mobile-stepper-bar";
import { WhatsAppButton } from "@/client/components/shared/whatsapp-button";
import { BusinessProfilePage } from "@/client/components/booking/business-profile-page";
import { ServiceSelection } from "@/client/components/booking/service-selection";
import { ServiceDetailStep } from "@/client/components/booking/service-detail-step";
import { ProfessionalSelection } from "@/client/components/booking/professional-selection";
import { DateTimeSelection } from "@/client/components/booking/date-time-selection";
import { ClientInfoStep } from "@/client/components/booking/client-info-step";
import { PaymentStep } from "@/client/components/booking/payment-step";
import { ConfirmationStep } from "@/client/components/booking/confirmation-step";
import { defaultStepConfig, getPreviousStep } from "@/client/lib/booking-steps";
import { useBookingFlow } from "@/client/hooks/use-booking-flow";
import { MOCK_BUSINESS_LOCATION } from "@/client/lib/mocks/booking-mocks";
import { cn } from "@/client/lib/utils";
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
}

interface BookingFlowProps {
  businessId: string;
  businessProfile: BusinessProfileData;
}

export function BookingFlow({ businessId, businessProfile }: BookingFlowProps) {
  const stepConfig: StepConfig[] = defaultStepConfig;
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [showProfilePage, setShowProfilePage] = useState(true);
  const [cameFromProfile, setCameFromProfile] = useState(false);
  const [serviceForDetail, setServiceForDetail] =
    useState<BookingService | null>(null);

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

  const handleBackToHome = () => {
    clearBooking();
    setServiceForDetail(null);
    setCameFromProfile(false);
    setShowProfilePage(true);
  };

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

  const renderStep = () => {
    if (showingDetail && serviceForDetail) {
      return (
        <ServiceDetailStep
          service={serviceForDetail}
          onConfirm={(svc) => {
            setServiceForDetail(null);
            setCameFromProfile(false);
            updateService(svc);
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
            onSelect={(svc) => setServiceForDetail(svc)}
            selectedServiceId={bookingData.service?.id}
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
      {!isConfirmation && (
        <BookingLeftPanel
          businessProfile={businessProfile}
          currentStep={currentStep}
          stepConfig={stepConfig}
          isStepComplete={isStepComplete}
          showingDetail={showingDetail}
          bookingData={bookingData}
        />
      )}

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

        <div
          className={cn(
            "flex-1 py-6 px-4 sm:py-8 sm:px-6",
            !isConfirmation && "mx-auto w-full max-w-2xl"
          )}
        >
          {!isConfirmation && (
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

        {(currentStep === "service" || showingDetail) &&
          businessProfile.phone && (
            <div className="lg:hidden border-t bg-card px-4 py-3">
              <WhatsAppButton phone={businessProfile.phone} justify="center" />
            </div>
          )}
      </div>
    </div>
  );
}
