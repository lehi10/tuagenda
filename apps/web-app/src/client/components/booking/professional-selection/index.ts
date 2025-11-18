/**
 * Professional Selection Module
 *
 * Exports both container and view components.
 * Use ProfessionalSelectionContainer for full functionality with data fetching.
 * Use ProfessionalSelectionView for presentation-only scenarios (Storybook, testing).
 */

export { ProfessionalSelectionContainer } from "./professional-selection-container";
export { ProfessionalSelectionView } from "./professional-selection-view";
export type { ProfessionalSelectionViewProps } from "./professional-selection-view";

// Default export for convenience
export { ProfessionalSelectionContainer as ProfessionalSelection } from "./professional-selection-container";
