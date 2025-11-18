/**
 * Service Selection Module
 *
 * Exports both container and view components.
 * Use ServiceSelectionContainer for full functionality with data fetching.
 * Use ServiceSelectionView for presentation-only scenarios (Storybook, testing).
 */

export { ServiceSelectionContainer } from "./service-selection-container";
export { ServiceSelectionView } from "./service-selection-view";
export type { ServiceSelectionViewProps } from "./service-selection-view";

// Default export for convenience
export { ServiceSelectionContainer as ServiceSelection } from "./service-selection-container";
