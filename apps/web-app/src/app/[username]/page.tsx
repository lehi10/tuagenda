"use client";

import { useState, useEffect } from "react";
import { BusinessProfile } from "@/components/booking/business-profile";
import { BookingSummary } from "@/components/booking/booking-summary";
import { ServiceSelection } from "@/components/booking/service-selection";
import { ProfessionalSelection } from "@/components/booking/professional-selection";
import { DateSelection } from "@/components/booking/date-selection";
import { TimeSlotSelection } from "@/components/booking/time-slot-selection";
import { ClientInfoStep } from "@/components/booking/client-info-step";
import { PaymentStep, PaymentMethod } from "@/components/booking/payment-step";
import { ConfirmationStep } from "@/components/booking/confirmation-step";
import { PublicFooter } from "@/components/public-footer";
import {
  defaultStepConfig,
  getNextStep,
  type StepType,
  type StepConfig,
} from "@/lib/booking-steps";

// Mock data - Replace with actual data fetching based on [username]
const mockBusiness = {
  name: "Salón de Belleza Elegance",
  description:
    "Tu destino para tratamientos de belleza profesionales y relajación",
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SalonElegance",
  email: "contacto@elegance.com",
  phone: "+51 999 888 777",
  location: "Av. Principal 123, Lima",
};

const mockServices = [
  {
    id: "1",
    name: "Corte de Cabello",
    description: "Corte personalizado según tu estilo",
    duration: 45,
    price: 25,
    category: "Cabello",
    location: "in-person" as const,
  },
  {
    id: "2",
    name: "Manicure",
    description: "Cuidado completo de uñas",
    duration: 30,
    price: 15,
    category: "Uñas",
    location: "in-person" as const,
  },
  {
    id: "3",
    name: "Masaje Relajante",
    description: "Masaje de cuerpo completo para aliviar el estrés",
    duration: 60,
    price: 40,
    category: "Masajes",
    location: "in-person" as const,
  },
  {
    id: "4",
    name: "Consulta Virtual",
    description: "Asesoría de imagen online",
    duration: 30,
    price: 20,
    category: "Consultoría",
    location: "virtual" as const,
  },
  {
    id: "5",
    name: "Facial",
    description: "Tratamiento facial hidratante",
    duration: 45,
    price: 35,
    category: "Faciales",
    location: "in-person" as const,
  },
  {
    id: "6",
    name: "Pedicure",
    description: "Cuidado completo de pies",
    duration: 40,
    price: 18,
    category: "Uñas",
    location: "in-person" as const,
  },
];

const mockProfessionals = [
  {
    id: "1",
    name: "María González",
    role: "Estilista Senior",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    available: true,
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    role: "Masajista",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    available: true,
  },
  {
    id: "3",
    name: "Ana Torres",
    role: "Especialista en Uñas",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    available: true,
  },
];

// Generate time slots (9 AM to 6 PM)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 18; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      available: Math.random() > 0.3,
    });
    slots.push({
      time: `${hour.toString().padStart(2, "0")}:30`,
      available: Math.random() > 0.3,
    });
  }
  return slots;
};

interface BookingData {
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
    location: "in-person" | "virtual";
  };
  professional?: {
    id: string;
    name: string;
  };
  date?: Date;
  timeSlot?: string;
  clientInfo?: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    createAccount: boolean;
  };
  paymentMethod?: PaymentMethod;
}

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function BookingPage({ params }: PageProps) {
  // You can modify this configuration based on business settings
  // For example, if business has only one professional:
  // const stepConfig = singleProfessionalConfig
  const stepConfig: StepConfig[] = defaultStepConfig;

  // Access the username parameter
  useEffect(() => {
    params.then((resolvedParams) => {
      console.log("Booking page for:", resolvedParams.username);
      // TODO: Fetch business data based on resolvedParams.username
    });
  }, [params]);

  const [bookingData, setBookingData] = useState<BookingData>({});
  const [currentStep, setCurrentStep] = useState<StepType>("service");
  const [isAuthenticated] = useState(false); // TODO: Get from auth context

  const timeSlots = generateTimeSlots();

  // Auto-select professional if only one is available and step is disabled
  useEffect(() => {
    const professionalStep = stepConfig.find((s) => s.id === "professional");
    if (!professionalStep?.enabled && mockProfessionals.length === 1) {
      setBookingData((prev) => ({
        ...prev,
        professional: {
          id: mockProfessionals[0].id,
          name: mockProfessionals[0].name,
        },
      }));
    }
  }, [stepConfig]);

  const goToNextStep = () => {
    const next = getNextStep(currentStep, stepConfig);
    if (next) {
      setCurrentStep(next);
    }
  };

  const handleServiceSelect = (service: (typeof mockServices)[0]) => {
    setBookingData({
      ...bookingData,
      service: {
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price,
        location: service.location,
      },
    });
    goToNextStep();
  };

  const handleProfessionalSelect = (
    professional: (typeof mockProfessionals)[0]
  ) => {
    setBookingData({
      ...bookingData,
      professional: {
        id: professional.id,
        name: professional.name,
      },
    });
    goToNextStep();
  };

  const handleDateSelect = (date: Date | undefined) => {
    setBookingData({
      ...bookingData,
      date: date,
      timeSlot: undefined,
    });
    if (date) {
      goToNextStep();
    }
  };

  const handleTimeSlotSelect = (slot: string) => {
    setBookingData({
      ...bookingData,
      timeSlot: slot,
    });
    goToNextStep();
  };

  const handleClientInfoSubmit = (data: {
    fullName: string;
    phone: string;
    email: string;
    password?: string;
    createAccount: boolean;
  }) => {
    setBookingData({
      ...bookingData,
      clientInfo: data,
    });
    goToNextStep();
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setBookingData({
      ...bookingData,
      paymentMethod: method,
    });
    goToNextStep();
  };

  const handleBackToHome = () => {
    setBookingData({});
    setCurrentStep("service");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    setBookingData({});
    setCurrentStep("service");
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case "service":
        return (
          <ServiceSelection
            services={mockServices}
            onSelect={handleServiceSelect}
            selectedServiceId={bookingData.service?.id}
          />
        );

      case "professional":
        return (
          <ProfessionalSelection
            professionals={mockProfessionals}
            onSelect={handleProfessionalSelect}
            selectedProfessionalId={bookingData.professional?.id}
          />
        );

      case "date":
        return (
          <DateSelection
            selectedDate={bookingData.date}
            onSelect={handleDateSelect}
          />
        );

      case "time":
        return (
          <TimeSlotSelection
            timeSlots={timeSlots}
            selectedSlot={bookingData.timeSlot}
            onSelect={handleTimeSlotSelect}
          />
        );

      case "client-info":
        return (
          <ClientInfoStep
            onContinue={handleClientInfoSubmit}
            isAuthenticated={isAuthenticated}
          />
        );

      case "payment":
        return (
          <PaymentStep
            onContinue={handlePaymentMethodSelect}
            isInPerson={bookingData.service?.location === "in-person"}
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
              businessLocation: {
                address: mockBusiness.location,
                lat: -12.0464, // Mock coordinates for Lima, Peru
                lng: -77.0428,
              },
            }}
            onBackToHome={handleBackToHome}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <BusinessProfile business={mockBusiness} />

      <div className="container mx-auto flex-1 px-4 py-8">
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
                  onClear={handleClear}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
