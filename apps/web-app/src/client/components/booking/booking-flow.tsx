"use client";

import { useState } from "react";
import { BookingSummary } from "@/client/components/booking/booking-summary";
import { ServiceSelection } from "@/client/components/booking/service-selection";
import { ProfessionalSelection } from "@/client/components/booking/professional-selection";
import { DateSelection } from "@/client/components/booking/date-selection";
import { TimeSlotSelection } from "@/client/components/booking/time-slot-selection";
import { ClientInfoStep } from "@/client/components/booking/client-info-step";
import { PaymentStep } from "@/client/components/booking/payment-step";
import { ConfirmationStep } from "@/client/components/booking/confirmation-step";
import { defaultStepConfig } from "@/client/lib/booking-steps";
import { generateTimeSlots } from "@/client/lib/booking-utils";
import { useBookingFlow } from "@/client/hooks/use-booking-flow";
import { MOCK_BUSINESS_LOCATION } from "@/client/lib/mocks/booking-mocks";
import type { StepConfig } from "@/client/types/booking";

interface BookingFlowProps {
  businessId: string;
}

export function BookingFlow({ businessId }: BookingFlowProps) {
  // You can modify this configuration based on business settings
  // For example, if business has only one professional:
  // const stepConfig = singleProfessionalConfig
  const stepConfig: StepConfig[] = defaultStepConfig;

  const [isAuthenticated] = useState(false); // TODO: Get from auth context

  // Use the booking flow hook for state management
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
  } = useBookingFlow({ stepConfig });

  // Generate time slots
  const timeSlots = generateTimeSlots();

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case "service":
        return (
          <ServiceSelection
            businessId={businessId}
            onSelect={updateService}
            selectedServiceId={bookingData.service?.id}
          />
        );

      case "professional":
        return (
          <ProfessionalSelection
            businessId={businessId}
            onSelect={(professional) =>
              updateProfessional({
                id: professional.id,
                name: professional.name,
              })
            }
            selectedProfessionalId={bookingData.professional?.id}
            serviceId={bookingData.service?.id}
          />
        );

      case "date":
        return (
          <DateSelection
            selectedDate={bookingData.date}
            onSelect={updateDate}
          />
        );

      case "time":
        return (
          <TimeSlotSelection
            timeSlots={timeSlots}
            selectedSlot={bookingData.timeSlot}
            onSelect={updateTimeSlot}
          />
        );

      case "client-info":
        return (
          <ClientInfoStep
            onContinue={updateClientInfo}
            isAuthenticated={isAuthenticated}
          />
        );

      case "payment":
        return (
          <PaymentStep
            onContinue={updatePaymentMethod}
            isInPerson={true} // Default to in-person for now
          />
        );

      case "confirmation":
        return (
          <ConfirmationStep
            bookingSummary={{
              service: bookingData.service!,
              professional: bookingData.professional,
              date: bookingData.date!,
              timeSlot: bookingData.timeSlot!,
              clientInfo: bookingData.clientInfo!,
              paymentMethod: bookingData.paymentMethod!,
              businessLocation: MOCK_BUSINESS_LOCATION,
            }}
            onBackToHome={clearBooking}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto flex-1 px-4 py-6 sm:py-8">
      {currentStep === "confirmation" ? (
        // Full width for confirmation step
        <div className="w-full">{renderStep()}</div>
      ) : (
        // Two column layout for booking steps
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">{renderStep()}</div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <BookingSummary
                bookingData={bookingData}
                onClear={clearBooking}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
