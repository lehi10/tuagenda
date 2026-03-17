/**
 * Create Appointment Use Case
 *
 * Creates a new appointment in the system.
 * This handles both authenticated users and guest users.
 *
 * Business Rules:
 * - Customer ID is required (can be authenticated or guest user)
 * - Business, service, start and end times are required
 * - End time must be after start time
 * - Status is set to "scheduled" by default
 *
 * @module core/application/use-cases/appointment
 */

import type { IAppointmentRepository } from "@/server/core/domain/repositories/IAppointmentRepository";
import type { Appointment } from "@/server/core/domain/entities/Appointment";

export interface CreateAppointmentInput {
  customerId: string; // Can be authenticated user ID or guest user ID
  businessId: string;
  serviceId: string;
  providerBusinessUserId?: string | null; // Optional: specific professional
  startTime: Date;
  endTime: Date;
  notes?: string | null;
  isGroup?: boolean;
  capacity?: number | null;
}

export class CreateAppointmentUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(input: CreateAppointmentInput): Promise<Appointment> {
    // 1. Validate required fields
    if (!input.customerId) {
      throw new Error("Customer ID is required");
    }

    if (!input.businessId) {
      throw new Error("Business ID is required");
    }

    if (!input.serviceId) {
      throw new Error("Service ID is required");
    }

    if (!input.startTime || !input.endTime) {
      throw new Error("Start time and end time are required");
    }

    // 2. Validate that end time is after start time
    if (input.endTime <= input.startTime) {
      throw new Error("End time must be after start time");
    }

    // 3. Create the appointment entity
    const appointment: Appointment = {
      customerId: input.customerId,
      businessId: input.businessId,
      serviceId: input.serviceId,
      providerBusinessUserId: input.providerBusinessUserId || null,
      startTime: input.startTime,
      endTime: input.endTime,
      notes: input.notes || null,
      isGroup: input.isGroup || false,
      capacity: input.capacity || null,
      status: "scheduled",
    };

    // 4. Persist to database
    const createdAppointment =
      await this.appointmentRepository.create(appointment);

    return createdAppointment;
  }
}
