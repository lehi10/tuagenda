import { IAppointmentRepository } from "@/server/core/domain/repositories/IAppointmentRepository";
import { Appointment } from "@/server/core/domain/entities/Appointment";
import { logger } from "@/server/lib/logger";

export interface GetCustomerUpcomingAppointmentsInput {
  customerId: string;
  businessId?: string;
}

export interface GetCustomerUpcomingAppointmentsResult {
  success: boolean;
  appointments?: Appointment[];
  error?: string;
}

export class GetCustomerUpcomingAppointmentsUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    input: GetCustomerUpcomingAppointmentsInput
  ): Promise<GetCustomerUpcomingAppointmentsResult> {
    try {
      logger.info(
        "GetCustomerUpcomingAppointmentsUseCase",
        "system",
        `Fetching upcoming appointments for customer: ${input.customerId}`
      );

      const appointments =
        await this.appointmentRepository.findUpcomingByCustomer(
          input.customerId,
          input.businessId
        );

      logger.info(
        "GetCustomerUpcomingAppointmentsUseCase",
        "system",
        `Found ${appointments.length} upcoming appointments`
      );

      return { success: true, appointments };
    } catch (error) {
      logger.error(
        "GetCustomerUpcomingAppointmentsUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return {
        success: false,
        error: "Failed to fetch upcoming appointments",
      };
    }
  }
}
