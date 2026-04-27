// Booking step configuration
// This can be easily modified or loaded from a database

export type StepType =
  | "service-detail"
  | "professional"
  | "date"
  | "time"
  | "client-info"
  | "summary"
  | "payment"
  | "confirmation";

export interface StepConfig {
  id: StepType;
  enabled: boolean;
  required: boolean;
  order: number;
}

// Default step configuration
// You can modify this or load it from a database
export const defaultStepConfig: StepConfig[] = [
  {
    id: "service-detail",
    enabled: true,
    required: true,
    order: 2,
  },
  {
    id: "professional",
    enabled: true, // Set to false if only one professional
    required: true,
    order: 3,
  },
  {
    id: "date",
    enabled: true,
    required: true,
    order: 4,
  },
  {
    id: "time",
    enabled: false, // Merged into "date" step (date + time on the same page)
    required: true,
    order: 5,
  },
  {
    id: "client-info",
    enabled: true,
    required: true,
    order: 6,
  },
  {
    id: "summary",
    enabled: true,
    required: true,
    order: 7,
  },
  {
    id: "payment",
    enabled: true,
    required: true,
    order: 8,
  },
  {
    id: "confirmation",
    enabled: true,
    required: true,
    order: 9,
  },
];

// Helper to get enabled steps in order
export function getEnabledSteps(config: StepConfig[]): StepConfig[] {
  return config
    .filter((step) => step.enabled)
    .sort((a, b) => a.order - b.order);
}

// Helper to get next step
export function getNextStep(
  currentStep: StepType,
  config: StepConfig[]
): StepType | null {
  const enabledSteps = getEnabledSteps(config);
  const currentIndex = enabledSteps.findIndex(
    (step) => step.id === currentStep
  );

  if (currentIndex === -1 || currentIndex === enabledSteps.length - 1) {
    return null;
  }

  return enabledSteps[currentIndex + 1].id;
}

// Helper to get previous step
export function getPreviousStep(
  currentStep: StepType,
  config: StepConfig[]
): StepType | null {
  const enabledSteps = getEnabledSteps(config);
  const currentIndex = enabledSteps.findIndex(
    (step) => step.id === currentStep
  );

  if (currentIndex <= 0) {
    return null;
  }

  return enabledSteps[currentIndex - 1].id;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic step config builder
// Add new conditions here — this is the single source of truth for flow logic.
// ─────────────────────────────────────────────────────────────────────────────

export interface StepConfigOptions {
  /**
   * Skip the payment step entirely.
   * Typically: service.price === 0 && !service.requiresOnlinePayment
   */
  skipPayment: boolean;
}

export function buildStepConfig(options: StepConfigOptions): StepConfig[] {
  return defaultStepConfig.map((step) => {
    if (step.id === "payment" && options.skipPayment) {
      return { ...step, enabled: false, required: false };
    }
    return step;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Static preset configs (kept for reference / simple cases)
// ─────────────────────────────────────────────────────────────────────────────

// Example: Configuration for a business with only one professional
export const singleProfessionalConfig: StepConfig[] = [
  {
    id: "service-detail",
    enabled: true,
    required: true,
    order: 2,
  },
  {
    id: "professional",
    enabled: false, // Disabled - skip this step
    required: false,
    order: 3,
  },
  {
    id: "date",
    enabled: true,
    required: true,
    order: 4,
  },
  {
    id: "time",
    enabled: false, // Merged into "date" step
    required: true,
    order: 5,
  },
  {
    id: "client-info",
    enabled: true,
    required: true,
    order: 6,
  },
  {
    id: "summary",
    enabled: true,
    required: true,
    order: 7,
  },
  {
    id: "payment",
    enabled: true,
    required: true,
    order: 8,
  },
  {
    id: "confirmation",
    enabled: true,
    required: true,
    order: 9,
  },
];
