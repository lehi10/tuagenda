/**
 * Booking Flow State Management Hook
 *
 * Custom hook to manage the booking flow state and navigation.
 * Extracts all business logic from the BookingFlow component.
 */

import { useState, useCallback, useEffect } from "react";
import { getNextStep, type StepConfig } from "@/client/lib/booking-steps";
import type {
  BookingData,
  BookingService,
  BookingProfessional,
  TimeSlot,
  ClientInfo,
  PaymentMethod,
  StepType,
} from "@/client/types/booking";

interface UseBookingFlowOptions {
  stepConfig: StepConfig[];
  initialStep?: StepType;
  onStepChange?: (step: StepType) => void;
}

interface UseBookingFlowReturn {
  // State
  bookingData: BookingData;
  currentStep: StepType;

  // Navigation
  goToNextStep: () => void;
  goToStep: (step: StepType) => void;

  // Data updates
  updateService: (service: BookingService) => void;
  updateProfessional: (professional: BookingProfessional) => void;
  updateDate: (date: Date | undefined) => void;
  updateTimeSlot: (slot: TimeSlot) => void;
  updateClientInfo: (clientInfo: ClientInfo) => void;
  updatePaymentMethod: (paymentMethod: PaymentMethod) => void;

  // Actions
  clearBooking: () => void;

  // Helpers
  isStepComplete: (step: StepType) => boolean;
  canProceedToNextStep: () => boolean;
}

/**
 * Custom hook to manage booking flow state
 */
export function useBookingFlow({
  stepConfig,
  initialStep = "service-detail",
  onStepChange,
}: UseBookingFlowOptions): UseBookingFlowReturn {
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [currentStep, setCurrentStep] = useState<StepType>(initialStep);

  // Call onStepChange callback when step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  /**
   * Navigate to next step in the flow
   */
  const goToNextStep = useCallback(() => {
    const next = getNextStep(currentStep, stepConfig);
    if (next) {
      setCurrentStep(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, stepConfig]);

  /**
   * Navigate to a specific step
   */
  const goToStep = useCallback((step: StepType) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /**
   * Update service selection.
   * Clears all downstream data (professional, date, time) since availability
   * depends on the service duration and may differ per professional.
   */
  const updateService = useCallback((service: BookingService) => {
    setBookingData((prev) => ({
      ...prev,
      service,
      professional: undefined,
      date: undefined,
      timeSlot: undefined,
      slotStartTime: undefined,
      slotEndTime: undefined,
    }));
  }, []);

  /**
   * Update professional selection.
   * Clears date and time since availability is per-professional.
   */
  const updateProfessional = useCallback(
    (professional: BookingProfessional) => {
      setBookingData((prev) => ({
        ...prev,
        professional,
        date: undefined,
        timeSlot: undefined,
        slotStartTime: undefined,
        slotEndTime: undefined,
      }));
      goToNextStep();
    },
    [goToNextStep]
  );

  /**
   * Update date selection.
   * Does NOT auto-advance — date and time are selected on the same step.
   * Navigation happens when the time slot is selected via updateTimeSlot.
   */
  const updateDate = useCallback((date: Date | undefined) => {
    setBookingData((prev) => ({
      ...prev,
      date,
      timeSlot: undefined,
      slotStartTime: undefined,
      slotEndTime: undefined,
    }));
  }, []);

  /**
   * Update time slot selection.
   * Stores both the display string and the UTC Date objects from the server.
   */
  const updateTimeSlot = useCallback(
    (slot: TimeSlot) => {
      setBookingData((prev) => ({
        ...prev,
        timeSlot: slot.time,
        slotStartTime: slot.startTime,
        slotEndTime: slot.endTime,
      }));
      goToNextStep();
    },
    [goToNextStep]
  );

  /**
   * Update client information
   */
  const updateClientInfo = useCallback(
    (clientInfo: ClientInfo) => {
      setBookingData((prev) => ({ ...prev, clientInfo }));
      goToNextStep();
    },
    [goToNextStep]
  );

  /**
   * Update payment method
   */
  const updatePaymentMethod = useCallback(
    (paymentMethod: PaymentMethod) => {
      setBookingData((prev) => ({ ...prev, paymentMethod }));
      goToNextStep();
    },
    [goToNextStep]
  );

  /**
   * Clear all booking data and reset to first step
   */
  const clearBooking = useCallback(() => {
    setBookingData({});
    setCurrentStep("service-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /**
   * Check if a specific step has been completed
   */
  const isStepComplete = useCallback(
    (step: StepType): boolean => {
      switch (step) {
        case "service-detail":
          return !!bookingData.service;
        case "professional":
          return !!bookingData.professional;
        case "date":
          return !!bookingData.date;
        case "time":
          return !!bookingData.timeSlot;
        case "client-info":
          return !!bookingData.clientInfo;
        case "summary":
          return !!bookingData.clientInfo;
        case "payment":
          return !!bookingData.paymentMethod;
        case "confirmation":
          return (
            !!bookingData.service &&
            !!bookingData.date &&
            !!bookingData.timeSlot &&
            !!bookingData.clientInfo &&
            !!bookingData.paymentMethod
          );
        default:
          return false;
      }
    },
    [bookingData]
  );

  /**
   * Check if user can proceed to next step
   */
  const canProceedToNextStep = useCallback((): boolean => {
    return isStepComplete(currentStep);
  }, [currentStep, isStepComplete]);

  return {
    // State
    bookingData,
    currentStep,

    // Navigation
    goToNextStep,
    goToStep,

    // Data updates
    updateService,
    updateProfessional,
    updateDate,
    updateTimeSlot,
    updateClientInfo,
    updatePaymentMethod,

    // Actions
    clearBooking,

    // Helpers
    isStepComplete,
    canProceedToNextStep,
  };
}
