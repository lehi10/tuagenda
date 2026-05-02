import { IAppointmentRepository } from "@/server/core/domain/repositories/IAppointmentRepository";
import {
  Appointment,
  AppointmentStatus,
} from "@/server/core/domain/entities/Appointment";
import { logger } from "@/server/lib/logger";

const ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  scheduled: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: ["scheduled"],
};

export interface UpdateAppointmentStatusInput {
  appointmentId: string;
  businessId: string;
  status: AppointmentStatus;
}

export interface UpdateAppointmentStatusResult {
  success: boolean;
  appointment?: Appointment;
  error?: string;
}

export class UpdateAppointmentStatusUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    input: UpdateAppointmentStatusInput
  ): Promise<UpdateAppointmentStatusResult> {
    try {
      logger.info(
        "UpdateAppointmentStatusUseCase",
        "system",
        `Updating appointment ${input.appointmentId} to status: ${input.status}`
      );

      const existing = await this.appointmentRepository.findById(
        input.appointmentId
      );

      if (!existing) {
        return { success: false, error: "Appointment not found" };
      }

      if (existing.businessId !== input.businessId) {
        return { success: false, error: "Appointment not found" };
      }

      const allowed = ALLOWED_TRANSITIONS[existing.status] ?? [];
      if (!allowed.includes(input.status)) {
        return {
          success: false,
          error: `Cannot transition from "${existing.status}" to "${input.status}"`,
        };
      }

      const updated = await this.appointmentRepository.update({
        ...existing,
        status: input.status,
      });

      logger.info(
        "UpdateAppointmentStatusUseCase",
        "system",
        `Appointment ${input.appointmentId} updated to ${input.status}`
      );

      return { success: true, appointment: updated };
    } catch (error) {
      logger.error(
        "UpdateAppointmentStatusUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to update appointment status" };
    }
  }
}
