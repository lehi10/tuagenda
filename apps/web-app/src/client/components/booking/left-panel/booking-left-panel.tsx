"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { WhatsAppButton } from "@/client/components/shared/whatsapp-button";
import { VerticalStepper } from "@/client/components/booking/steppers/vertical-stepper";
import { LeftPanelSummary } from "@/client/components/booking/left-panel/left-panel-summary";
import type {
  BookingService,
  StepConfig,
  StepType,
} from "@/client/types/booking";

interface BookingLeftPanelProps {
  businessProfile: {
    name: string;
    avatar?: string | null;
    location?: string;
    phone?: string;
  };
  currentStep: StepType;
  stepConfig: StepConfig[];
  isStepComplete: (step: StepType) => boolean;
  showingDetail: boolean;
  bookingData: {
    service?: BookingService;
    professional?: { name: string };
    date?: Date;
    timeSlot?: string;
  };
}

export function BookingLeftPanel({
  businessProfile,
  currentStep,
  stepConfig,
  isStepComplete,
  showingDetail,
  bookingData,
}: BookingLeftPanelProps) {
  return (
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
          <WhatsAppButton phone={businessProfile.phone} />
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
  );
}
