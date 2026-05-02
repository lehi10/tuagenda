/**
 * Appointment Mapper
 *
 * Maps between Prisma Appointment model and Domain Appointment entity.
 * This keeps the domain independent from infrastructure concerns.
 *
 * @module infrastructure/mappers
 */

import {
  Appointment as PrismaAppointment,
  User as PrismaUser,
  BusinessUser as PrismaBusinessUser,
  Service as PrismaService,
  ServiceCategory as PrismaServiceCategory,
  Business as PrismaBusiness,
} from "db";
import type { BusinessNotificationSettings } from "notifications";
import {
  Appointment,
  AppointmentStatus,
} from "@/server/core/domain/entities/Appointment";

type PrismaAppointmentWithRelations = PrismaAppointment & {
  customer?: PrismaUser | null;
  providerBusinessUser?:
    | (PrismaBusinessUser & {
        user: PrismaUser;
      })
    | null;
  service?: PrismaService & { category?: PrismaServiceCategory | null };
  business?: PrismaBusiness;
};

export class AppointmentMapper {
  /**
   * Convert Prisma Appointment model to Domain Appointment entity
   */
  static toDomain(
    prismaAppointment: PrismaAppointmentWithRelations
  ): Appointment {
    return {
      id: prismaAppointment.id,
      customerId: prismaAppointment.customerId,
      providerBusinessUserId: prismaAppointment.providerBusinessUserId,
      businessId: prismaAppointment.businessId,
      serviceId: prismaAppointment.serviceId,
      startTime: prismaAppointment.startTime,
      endTime: prismaAppointment.endTime,
      isGroup: prismaAppointment.isGroup,
      capacity: prismaAppointment.capacity,
      status: prismaAppointment.status as AppointmentStatus,
      notes: prismaAppointment.notes,
      createdAt: prismaAppointment.createdAt,
      updatedAt: prismaAppointment.updatedAt,

      // Include related data if present
      customer: prismaAppointment.customer
        ? {
            id: prismaAppointment.customer.id,
            firstName: prismaAppointment.customer.firstName,
            lastName: prismaAppointment.customer.lastName,
            email: prismaAppointment.customer.email,
            phone: prismaAppointment.customer.phone,
          }
        : undefined,

      providerBusinessUser: prismaAppointment.providerBusinessUser
        ? {
            id: prismaAppointment.providerBusinessUser.id,
            displayName: prismaAppointment.providerBusinessUser.displayName,
            user: {
              id: prismaAppointment.providerBusinessUser.user.id,
              firstName: prismaAppointment.providerBusinessUser.user.firstName,
              lastName: prismaAppointment.providerBusinessUser.user.lastName,
              email: prismaAppointment.providerBusinessUser.user.email,
              pictureFullPath:
                prismaAppointment.providerBusinessUser.user.pictureFullPath,
            },
          }
        : undefined,

      service: prismaAppointment.service
        ? {
            id: prismaAppointment.service.id,
            name: prismaAppointment.service.name,
            description: prismaAppointment.service.description,
            price: Number(prismaAppointment.service.price),
            durationMinutes: prismaAppointment.service.durationMinutes,
            category: prismaAppointment.service.category
              ? {
                  id: prismaAppointment.service.category.id,
                  name: prismaAppointment.service.category.name,
                }
              : null,
          }
        : undefined,

      business: prismaAppointment.business
        ? {
            id: prismaAppointment.business.id,
            title: prismaAppointment.business.title,
            slug: prismaAppointment.business.slug,
            logo: prismaAppointment.business.logo,
            coverImage: prismaAppointment.business.coverImage,
            address: prismaAppointment.business.address,
            city: prismaAppointment.business.city,
            phone: prismaAppointment.business.phone,
            email: prismaAppointment.business.email,
            website: prismaAppointment.business.website,
            currency: prismaAppointment.business.currency,
            notificationSettings: (prismaAppointment.business
              .notificationSettings ??
              null) as BusinessNotificationSettings | null,
          }
        : undefined,
    };
  }

  /**
   * Convert array of Prisma Appointments to array of Domain Appointments
   */
  static toDomainList(
    prismaAppointments: PrismaAppointmentWithRelations[]
  ): Appointment[] {
    return prismaAppointments.map((prismaAppointment) =>
      this.toDomain(prismaAppointment)
    );
  }
}
