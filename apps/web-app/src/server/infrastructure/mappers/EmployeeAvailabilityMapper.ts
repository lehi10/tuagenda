import type { EmployeeAvailability as PrismaEmployeeAvailability } from "@prisma/client";
import {
  EmployeeAvailability,
  type EmployeeAvailabilityProps,
} from "@/server/core/domain/entities";

export class EmployeeAvailabilityMapper {
  static toDomain(prisma: PrismaEmployeeAvailability): EmployeeAvailability {
    const props: EmployeeAvailabilityProps = {
      id: prisma.id,
      businessUserId: prisma.businessUserId,
      businessId: prisma.businessId,
      dayOfWeek: prisma.dayOfWeek,
      startTime: prisma.startTime,
      endTime: prisma.endTime,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };

    return EmployeeAvailability.fromObject(props);
  }

  static toPrisma(
    domain: EmployeeAvailability
  ): Omit<PrismaEmployeeAvailability, "createdAt" | "updatedAt"> {
    return {
      id: domain.id,
      businessUserId: domain.businessUserId,
      businessId: domain.businessId,
      dayOfWeek: domain.dayOfWeek,
      startTime: domain.startTime,
      endTime: domain.endTime,
    };
  }

  static toDomainArray(
    prismaArray: PrismaEmployeeAvailability[]
  ): EmployeeAvailability[] {
    return prismaArray.map((prisma) => this.toDomain(prisma));
  }
}
