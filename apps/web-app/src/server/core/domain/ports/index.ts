/**
 * Domain Ports (Interfaces for external services)
 *
 * Ports define contracts for services that are NOT entity persistence.
 * For entity persistence, see /repositories.
 *
 * Examples of ports:
 * - Authorization (permission checking)
 * - Email (notifications)
 * - Payment (transactions)
 * - Storage (file uploads)
 */

export type {
  IAuthorizationPort,
  AuthorizationRequest,
} from "./IAuthorizationPort";
