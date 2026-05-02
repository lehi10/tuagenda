/**
 * Prisma Appointment Repository (Adapter)
 *
 * This is an ADAPTER in hexagonal architecture.
 * It implements the IAppointmentRepository port using Prisma as the persistence mechanism.
 * The domain layer depends on the interface, not this implementation.
 *
 * @module infrastructure/repositories
 */

import { prisma } from "db";
import {
  IAppointmentRepository,
  AppointmentRepositoryFilters,
} from "@/server/core/domain/repositories/IAppointmentRepository";
import { Appointment } from "@/server/core/domain/entities/Appointment";
import { AppointmentMapper } from "../mappers/AppointmentMapper";
import {
  Prisma,
  AppointmentStatus as PrismaAppointmentStatus,
} from "@prisma/client";

export class PrismaAppointmentRepository implements IAppointmentRepository {
  /**
   * Find an appointment by its ID
   */
  async findById(id: string): Promise<Appointment | null> {
    const prismaAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        customer: true,
        providerBusinessUser: {
          include: {
            user: true,
          },
        },
        service: { include: { category: true } },
        business: true,
      },
    });

    if (!prismaAppointment) {
      return null;
    }

    return AppointmentMapper.toDomain(prismaAppointment);
  }

  /**
   * Find upcoming appointments for a customer
   * Ordered by startTime (ascending) - closest first
   * Includes all appointments from today onwards
   */
  async findUpcomingByCustomer(
    customerId: string,
    businessId?: string
  ): Promise<Appointment[]> {
    // Start of today (00:00:00)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const where: Prisma.AppointmentWhereInput = {
      customerId,
      startTime: {
        gte: startOfToday,
      },
      status: {
        in: ["scheduled", "confirmed"],
      },
    };

    if (businessId) {
      where.businessId = businessId;
    }

    const prismaAppointments = await prisma.appointment.findMany({
      where,
      include: {
        providerBusinessUser: {
          include: {
            user: true,
          },
        },
        service: { include: { category: true } },
        business: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return AppointmentMapper.toDomainList(prismaAppointments);
  }

  /**
   * Find past appointments for a customer
   * Ordered by startTime (descending) - most recent first
   * Includes all appointments before today (yesterday and earlier)
   */
  async findPastByCustomer(
    customerId: string,
    businessId?: string
  ): Promise<Appointment[]> {
    // Start of today (00:00:00)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const where: Prisma.AppointmentWhereInput = {
      customerId,
      startTime: {
        lt: startOfToday,
      },
    };

    if (businessId) {
      where.businessId = businessId;
    }

    const prismaAppointments = await prisma.appointment.findMany({
      where,
      include: {
        providerBusinessUser: {
          include: {
            user: true,
          },
        },
        service: { include: { category: true } },
        business: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return AppointmentMapper.toDomainList(prismaAppointments);
  }

  /**
   * Find all appointments with optional filtering
   */
  async findAll(
    filters?: AppointmentRepositoryFilters
  ): Promise<Appointment[]> {
    const where: Prisma.AppointmentWhereInput = {};

    if (filters) {
      if (filters.customerId) {
        where.customerId = filters.customerId;
      }

      if (filters.providerBusinessUserId) {
        where.providerBusinessUserId = filters.providerBusinessUserId;
      }

      if (filters.businessId) {
        where.businessId = filters.businessId;
      }

      if (filters.serviceId) {
        where.serviceId = filters.serviceId;
      }

      if (filters.status) {
        if (Array.isArray(filters.status)) {
          where.status = {
            in: filters.status as unknown as PrismaAppointmentStatus[],
          };
        } else {
          where.status = filters.status as unknown as PrismaAppointmentStatus;
        }
      }

      if (filters.startAfter || filters.startBefore) {
        where.startTime = {};
        if (filters.startAfter) {
          where.startTime.gte = filters.startAfter;
        }
        if (filters.startBefore) {
          where.startTime.lte = filters.startBefore;
        }
      }
    }

    const prismaAppointments = await prisma.appointment.findMany({
      where,
      include: {
        customer: true,
        providerBusinessUser: {
          include: {
            user: true,
          },
        },
        service: { include: { category: true } },
        business: true,
      },
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { startTime: "desc" },
    });

    return AppointmentMapper.toDomainList(prismaAppointments);
  }

  /**
   * Create a new appointment
   */
  async create(appointment: Appointment): Promise<Appointment> {
    const createdAppointment = await prisma.appointment.create({
      data: {
        customerId: appointment.customerId,
        providerBusinessUserId: appointment.providerBusinessUserId,
        businessId: appointment.businessId,
        serviceId: appointment.serviceId,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        isGroup: appointment.isGroup,
        capacity: appointment.capacity,
        status: appointment.status,
        notes: appointment.notes,
      },
      include: {
        customer: true,
        providerBusinessUser: {
          include: {
            user: true,
          },
        },
        service: { include: { category: true } },
        business: true,
      },
    });

    return AppointmentMapper.toDomain(createdAppointment);
  }

  /**
   * Update an existing appointment
   */
  async update(appointment: Appointment): Promise<Appointment> {
    if (!appointment.id) {
      throw new Error("Appointment ID is required for update");
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        customerId: appointment.customerId,
        providerBusinessUserId: appointment.providerBusinessUserId,
        serviceId: appointment.serviceId,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        isGroup: appointment.isGroup,
        capacity: appointment.capacity,
        status: appointment.status,
        notes: appointment.notes,
      },
      include: {
        customer: true,
        providerBusinessUser: {
          include: {
            user: true,
          },
        },
        service: { include: { category: true } },
        business: true,
      },
    });

    return AppointmentMapper.toDomain(updatedAppointment);
  }

  /**
   * Delete an appointment by ID
   */
  async delete(id: string): Promise<void> {
    await prisma.appointment.delete({
      where: { id },
    });
  }

  /**
   * Count total appointments with optional filters
   */
  async count(filters?: AppointmentRepositoryFilters): Promise<number> {
    const where: Prisma.AppointmentWhereInput = {};

    if (filters) {
      if (filters.customerId) {
        where.customerId = filters.customerId;
      }

      if (filters.providerBusinessUserId) {
        where.providerBusinessUserId = filters.providerBusinessUserId;
      }

      if (filters.businessId) {
        where.businessId = filters.businessId;
      }

      if (filters.serviceId) {
        where.serviceId = filters.serviceId;
      }

      if (filters.status) {
        if (Array.isArray(filters.status)) {
          where.status = {
            in: filters.status as unknown as PrismaAppointmentStatus[],
          };
        } else {
          where.status = filters.status as unknown as PrismaAppointmentStatus;
        }
      }

      if (filters.startAfter || filters.startBefore) {
        where.startTime = {};
        if (filters.startAfter) {
          where.startTime.gte = filters.startAfter;
        }
        if (filters.startBefore) {
          where.startTime.lte = filters.startBefore;
        }
      }
    }

    return await prisma.appointment.count({ where });
  }
}
