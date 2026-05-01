import type { BusinessProps } from "@/server/core/domain/entities/Business";
import type { BusinessUserProps } from "@/server/core/domain/entities/BusinessUser";
import { BusinessRole } from "@/server/core/domain/entities/BusinessUser";

/**
 * Shared type boundary for business-related domain types.
 * Client code must always import from here, never from @/server/core/domain directly.
 * Note: enums (BusinessRole) must be regular imports, not `import type`, so they exist at runtime.
 */
export type Business = BusinessProps;
export type { BusinessUserProps };
export { BusinessRole };
