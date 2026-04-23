"use client";

import { Check } from "lucide-react";
import { cn } from "@/client/lib/utils";
import { getEnabledSteps } from "@/client/lib/booking-steps";
import type { StepConfig, StepType } from "@/client/types/booking";

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

interface VerticalStepperProps {
  currentStep: StepType;
  stepConfig: StepConfig[];
  isStepComplete: (step: StepType) => boolean;
  showingDetail: boolean;
}

export function VerticalStepper({
  currentStep,
  stepConfig,
  isStepComplete,
  showingDetail,
}: VerticalStepperProps) {
  const enabledSteps = getEnabledSteps(stepConfig).filter((s) =>
    STEPPER_STEPS.includes(s.id)
  );
  const activeStepId = showingDetail ? "service" : currentStep;
  const currentIndex = enabledSteps.findIndex((s) => s.id === activeStepId);

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
              className={cn("pb-5", i === enabledSteps.length - 1 && "pb-0")}
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
