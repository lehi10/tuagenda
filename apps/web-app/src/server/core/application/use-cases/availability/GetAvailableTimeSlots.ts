/**
 * Get Available Time Slots Use Case
 *
 * This use case calculates available time slots for a business user (employee)
 * based on:
 * - Employee weekly availability (EmployeeAvailability)
 * - Employee exceptions (vacations, special hours, etc.)
 * - Existing appointments
 * - Service duration
 *
 * @module core/application/use-cases/availability
 *
 * @note Timezone Support
 * Currently assumes all date operations use the server's timezone.
 * When multi-timezone support is needed:
 * 1. Add businessId to input to fetch business.timeZone
 * 2. Install date-fns-tz: pnpm add date-fns-tz
 * 3. Convert all date operations to use business timezone
 * 4. Use utcToZonedTime/zonedTimeToUtc for conversions
 */

import { IEmployeeAvailabilityRepository } from "@/server/core/domain/repositories/IEmployeeAvailabilityRepository";
import { IEmployeeExceptionRepository } from "@/server/core/domain/repositories/IEmployeeExceptionRepository";
import { IAppointmentRepository } from "@/server/core/domain/repositories/IAppointmentRepository";
import { IServiceRepository } from "@/server/core/domain/repositories/IServiceRepository";
import { EmployeeAvailability } from "@/server/core/domain/entities/EmployeeAvailability";
import { EmployeeException } from "@/server/core/domain/entities/EmployeeException";
import { Appointment } from "@/server/core/domain/entities/Appointment";
import { logger } from "@/server/lib/logger";

export interface TimeSlot {
  time: string; // "09:00", "09:30", etc.
  startTime: Date; // Full datetime
  endTime: Date; // Full datetime (startTime + service duration)
  available: boolean;
}

export interface GetAvailableTimeSlotsInput {
  businessUserId: string;
  serviceId: string;
  date: Date;
}

export interface GetAvailableTimeSlotsResult {
  success: boolean;
  slots?: TimeSlot[];
  error?: string;
}

/**
 * Get Available Time Slots Use Case
 *
 * Business logic for calculating available time slots
 */
export class GetAvailableTimeSlotsUseCase {
  constructor(
    private readonly employeeAvailabilityRepository: IEmployeeAvailabilityRepository,
    private readonly employeeExceptionRepository: IEmployeeExceptionRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly serviceRepository: IServiceRepository
  ) {}

  async execute(
    input: GetAvailableTimeSlotsInput
  ): Promise<GetAvailableTimeSlotsResult> {
    try {
      logger.info(
        "GetAvailableTimeSlotsUseCase",
        "system",
        `Calculating slots for businessUser: ${input.businessUserId}, service: ${input.serviceId}, date: ${input.date.toISOString()}`
      );

      // 1. Get service to know duration
      const service = await this.serviceRepository.findById(input.serviceId);
      if (!service) {
        return {
          success: false,
          error: "Service not found",
        };
      }

      const serviceDuration = service.durationMinutes;
      // Use service duration as the interval between slots
      const intervalMinutes = serviceDuration;

      logger.info(
        "GetAvailableTimeSlotsUseCase",
        "system",
        `Service duration: ${serviceDuration} minutes, slot interval: ${intervalMinutes} minutes`
      );

      // 2. Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const dayOfWeek = input.date.getDay();

      // 3. Get employee availability for this day
      const availabilities =
        await this.employeeAvailabilityRepository.findByEmployeeAndDay(
          input.businessUserId,
          dayOfWeek
        );

      // If no availability configured, return empty slots
      if (availabilities.length === 0) {
        logger.warning(
          "GetAvailableTimeSlotsUseCase",
          "system",
          `No availability configured for businessUser ${input.businessUserId} on day ${dayOfWeek}`
        );
        return {
          success: true,
          slots: [],
        };
      }

      // 4. Get exceptions for this specific date
      const exceptions =
        await this.employeeExceptionRepository.findByEmployeeAndDate(
          input.businessUserId,
          input.date
        );

      // 5. Check if day is completely blocked
      const allDayException = exceptions.find((e) => e.isAllDay);
      if (allDayException && !allDayException.isAvailable) {
        logger.info(
          "GetAvailableTimeSlotsUseCase",
          "system",
          `Day is completely blocked due to exception: ${allDayException.reason}`
        );
        return {
          success: true,
          slots: [],
        };
      }

      // 6. Get existing appointments for this day
      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);

      const existingAppointments = await this.appointmentRepository.findAll({
        providerBusinessUserId: input.businessUserId,
        startAfter: startOfDay,
        startBefore: endOfDay,
        status: ["scheduled", "confirmed"],
      });

      logger.info(
        "GetAvailableTimeSlotsUseCase",
        "system",
        `Found ${existingAppointments.length} existing appointments`
      );

      // 7. Generate time slots
      const slots = this.generateTimeSlots(
        input.date,
        availabilities,
        exceptions,
        existingAppointments,
        serviceDuration,
        intervalMinutes
      );

      logger.info(
        "GetAvailableTimeSlotsUseCase",
        "system",
        `Generated ${slots.length} time slots (${slots.filter((s) => s.available).length} available)`
      );

      return {
        success: true,
        slots,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "GetAvailableTimeSlotsUseCase",
          "system",
          `Error calculating time slots: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "GetAvailableTimeSlotsUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while calculating time slots",
      };
    }
  }

  /**
   * Generate time slots based on availability, exceptions, and existing appointments
   */
  private generateTimeSlots(
    date: Date,
    availabilities: EmployeeAvailability[],
    exceptions: EmployeeException[],
    existingAppointments: Appointment[],
    serviceDuration: number,
    intervalMinutes: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];

    // Process each availability period (employee might have multiple periods per day)
    for (const availability of availabilities) {
      const periodSlots = this.generateSlotsForPeriod(
        date,
        availability.startTime,
        availability.endTime,
        exceptions,
        existingAppointments,
        serviceDuration,
        intervalMinutes
      );

      slots.push(...periodSlots);
    }

    // Sort slots by time
    slots.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return slots;
  }

  /**
   * Generate slots for a specific availability period
   */
  private generateSlotsForPeriod(
    date: Date,
    periodStartTime: Date,
    periodEndTime: Date,
    exceptions: EmployeeException[],
    existingAppointments: Appointment[],
    serviceDuration: number,
    intervalMinutes: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];

    // Extract hours and minutes from period times
    const startHour = periodStartTime.getHours();
    const startMinute = periodStartTime.getMinutes();
    const endHour = periodEndTime.getHours();
    const endMinute = periodEndTime.getMinutes();

    // Create datetime for the start of the period on the target date
    let currentSlotStart = new Date(date);
    currentSlotStart.setHours(startHour, startMinute, 0, 0);

    const periodEnd = new Date(date);
    periodEnd.setHours(endHour, endMinute, 0, 0);

    // Generate slots at intervals
    while (currentSlotStart < periodEnd) {
      const slotEndTime = new Date(
        currentSlotStart.getTime() + serviceDuration * 60 * 1000
      );

      // Only add slot if the service can be completed before period ends
      if (slotEndTime <= periodEnd) {
        const available = this.isSlotAvailable(
          currentSlotStart,
          slotEndTime,
          exceptions,
          existingAppointments
        );

        slots.push({
          time: this.formatTime(currentSlotStart),
          startTime: new Date(currentSlotStart),
          endTime: new Date(slotEndTime),
          available,
        });
      }

      // Move to next slot
      currentSlotStart = new Date(
        currentSlotStart.getTime() + intervalMinutes * 60 * 1000
      );
    }

    return slots;
  }

  /**
   * Check if a time slot is available
   */
  private isSlotAvailable(
    slotStart: Date,
    slotEnd: Date,
    exceptions: EmployeeException[],
    existingAppointments: Appointment[]
  ): boolean {
    // Check if slot conflicts with any exception
    for (const exception of exceptions) {
      // All-day exceptions are already filtered out
      // Check time-specific exceptions
      if (!exception.isAllDay) {
        const exceptionStart = new Date(slotStart);
        if (exception.startTime) {
          exceptionStart.setHours(
            exception.startTime.getHours(),
            exception.startTime.getMinutes(),
            0,
            0
          );
        }

        const exceptionEnd = new Date(slotStart);
        if (exception.endTime) {
          exceptionEnd.setHours(
            exception.endTime.getHours(),
            exception.endTime.getMinutes(),
            0,
            0
          );
        }

        // If exception is a block (isAvailable = false)
        if (!exception.isAvailable) {
          // Check if slot overlaps with blocked period
          if (
            this.timesOverlap(slotStart, slotEnd, exceptionStart, exceptionEnd)
          ) {
            return false;
          }
        }
      }
    }

    // Check if slot conflicts with existing appointments
    for (const appointment of existingAppointments) {
      if (
        this.timesOverlap(
          slotStart,
          slotEnd,
          appointment.startTime,
          appointment.endTime
        )
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if two time periods overlap
   */
  private timesOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    return start1 < end2 && end1 > start2;
  }

  /**
   * Format time as HH:MM
   */
  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
}
