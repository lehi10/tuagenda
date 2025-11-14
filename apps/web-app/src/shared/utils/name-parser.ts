/**
 * Name Parser Utility
 *
 * Utilities for parsing full names into first and last names.
 * Handles edge cases like single names, multiple spaces, etc.
 *
 * @module lib/utils/name-parser
 */

/**
 * Parse a full name into first and last name components
 *
 * @param fullName - The full name to parse
 * @returns Object with firstName and lastName
 *
 * @example
 * ```typescript
 * parseFullName("John Doe")
 * // { firstName: "John", lastName: "Doe" }
 *
 * parseFullName("María García López")
 * // { firstName: "María", lastName: "García López" }
 *
 * parseFullName("John")
 * // { firstName: "John", lastName: "" }
 *
 * parseFullName("")
 * // { firstName: "User", lastName: "" }
 * ```
 */
export function parseFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/);

  return {
    firstName: parts[0] || "User",
    lastName: parts.slice(1).join(" ") || "",
  };
}
