import {
  IAppointmentRepository,
  AppointmentRepositoryFilters,
} from "@/server/core/domain/repositories/IAppointmentRepository";
import { Appointment } from "@/server/core/domain/entities/Appointment";
import { logger } from "@/server/lib/logger";

export interface GetBusinessAppointmentsInput {
  businessId: string;
  filters?: {
    status?: AppointmentRepositoryFilters["status"];
    providerBusinessUserId?: string;
    serviceId?: string;
    startAfter?: Date;
    startBefore?: Date;
  };
  pagination?: {
    limit?: number;
    offset?: number;
  };
}

export interface GetBusinessAppointmentsResult {
  success: boolean;
  appointments?: Appointment[];
  total?: number;
  error?: string;
}

export class GetBusinessAppointmentsUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    input: GetBusinessAppointmentsInput
  ): Promise<GetBusinessAppointmentsResult> {
    try {
      logger.info(
        "GetBusinessAppointmentsUseCase",
        "system",
        `Fetching appointments for business: ${input.businessId}`
      );

      // Build filters for repository
      const repositoryFilters: AppointmentRepositoryFilters = {
        businessId: input.businessId,
        ...input.filters,
        limit: input.pagination?.limit,
        offset: input.pagination?.offset,
      };

      // Get appointments and total count
      const [appointments, total] = await Promise.all([
        this.appointmentRepository.findAll(repositoryFilters),
        this.appointmentRepository.count({
          businessId: input.businessId,
          ...input.filters,
        }),
      ]);

      logger.info(
        "GetBusinessAppointmentsUseCase",
        "system",
        `Found ${appointments.length} appointments (total: ${total})`
      );

      return { success: true, appointments, total };
    } catch (error) {
      logger.error(
        "GetBusinessAppointmentsUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return {
        success: false,
        error: "Failed to fetch business appointments",
      };
    }
  }
}
