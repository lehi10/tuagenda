"use client";

import { Check } from "lucide-react";
import { cn } from "@/client/lib/utils";
import { getEnabledSteps } from "@/client/lib/booking-steps";
import type { StepConfig, StepType } from "@/client/types/booking";

const STEP_LABELS: Record<StepType, string> = {
  "service-detail": "Servicio",
  professional: "Profesional",
  date: "Fecha y hora",
  time: "Horario",
  "client-info": "Tu cuenta",
  summary: "Resumen",
  payment: "Pago",
  confirmation: "Listo",
};

const STEPPER_STEPS: StepType[] = [
  "service-detail",
  "professional",
  "date",
  "client-info",
  "summary",
  "payment",
];

interface MobileStepperBarProps {
  currentStep: StepType;
  stepConfig: StepConfig[];
  isStepComplete: (step: StepType) => boolean;
  showingDetail: boolean;
}

export function MobileStepperBar({
  currentStep,
  stepConfig,
  isStepComplete,
  showingDetail,
}: MobileStepperBarProps) {
  const enabledSteps = getEnabledSteps(stepConfig).filter((s) =>
    STEPPER_STEPS.includes(s.id)
  );
  const activeStepId = showingDetail ? "service-detail" : currentStep;
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
