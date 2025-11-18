import type { EmployeeException as PrismaEmployeeException } from "@prisma/client";
import {
  EmployeeException,
  type EmployeeExceptionProps,
} from "@/server/core/domain/entities";

export class EmployeeExceptionMapper {
  static toDomain(prisma: PrismaEmployeeException): EmployeeException {
    const props: EmployeeExceptionProps = {
      id: prisma.id,
      businessUserId: prisma.businessUserId,
      businessId: prisma.businessId,
      date: prisma.date,
      isAllDay: prisma.isAllDay,
      startTime: prisma.startTime ?? undefined,
      endTime: prisma.endTime ?? undefined,
      isAvailable: prisma.isAvailable,
      reason: prisma.reason ?? undefined,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };

    return EmployeeException.fromObject(props);
  }

  static toPrisma(
    domain: EmployeeException
  ): Omit<PrismaEmployeeException, "createdAt" | "updatedAt"> {
    return {
      id: domain.id,
      businessUserId: domain.businessUserId,
      businessId: domain.businessId,
      date: domain.date,
      isAllDay: domain.isAllDay,
      startTime: domain.startTime ?? null,
      endTime: domain.endTime ?? null,
      isAvailable: domain.isAvailable,
      reason: domain.reason ?? null,
    };
  }

  static toDomainArray(
    prismaArray: PrismaEmployeeException[]
  ): EmployeeException[] {
    return prismaArray.map((prisma) => this.toDomain(prisma));
  }
}
