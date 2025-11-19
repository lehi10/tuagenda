import { IAppointmentRepository } from "@/server/core/domain/repositories/IAppointmentRepository";
import { Appointment } from "@/server/core/domain/entities/Appointment";
import { logger } from "@/server/lib/logger";

export interface GetCustomerPastAppointmentsInput {
  customerId: string;
  businessId?: string;
}

export interface GetCustomerPastAppointmentsResult {
  success: boolean;
  appointments?: Appointment[];
  error?: string;
}

export class GetCustomerPastAppointmentsUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    input: GetCustomerPastAppointmentsInput
  ): Promise<GetCustomerPastAppointmentsResult> {
    try {
      logger.info(
        "GetCustomerPastAppointmentsUseCase",
        "system",
        `Fetching past appointments for customer: ${input.customerId}`
      );

      const appointments = await this.appointmentRepository.findPastByCustomer(
        input.customerId,
        input.businessId
      );

      logger.info(
        "GetCustomerPastAppointmentsUseCase",
        "system",
        `Found ${appointments.length} past appointments`
      );

      return { success: true, appointments };
    } catch (error) {
      logger.error(
        "GetCustomerPastAppointmentsUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to fetch past appointments" };
    }
  }
}
