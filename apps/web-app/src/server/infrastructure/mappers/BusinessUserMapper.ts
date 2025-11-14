/**
 * BusinessUser Mapper
 *
 * Maps between Prisma BusinessUser model and Domain BusinessUser entity.
 * This keeps the domain independent from infrastructure concerns.
 *
 * @module infrastructure/mappers
 */

import { BusinessUser as PrismaBusinessUser } from "db";
import {
  BusinessUser,
  BusinessRole,
} from "@/server/core/domain/entities/BusinessUser";

export class BusinessUserMapper {
  /**
   * Convert Prisma BusinessUser model to Domain BusinessUser entity
   */
  static toDomain(prismaBusinessUser: PrismaBusinessUser): BusinessUser {
    return new BusinessUser({
      id: prismaBusinessUser.id,
      userId: prismaBusinessUser.userId,
      businessId: prismaBusinessUser.businessId,
      role: prismaBusinessUser.role as BusinessRole,
      createdAt: prismaBusinessUser.createdAt,
      updatedAt: prismaBusinessUser.updatedAt,
    });
  }

  /**
   * Convert Domain BusinessUser entity to Prisma BusinessUser creation data
   */
  static toPrismaCreate(businessUser: BusinessUser) {
    const businessUserObj = businessUser.toObject();
    return {
      userId: businessUserObj.userId,
      businessId: businessUserObj.businessId,
      role: businessUserObj.role,
    };
  }

  /**
   * Convert Domain BusinessUser entity to Prisma BusinessUser update data
   */
  static toPrismaUpdate(businessUser: BusinessUser) {
    const businessUserObj = businessUser.toObject();
    return {
      role: businessUserObj.role,
      updatedAt: new Date(),
    };
  }

  /**
   * Convert array of Prisma BusinessUsers to array of Domain BusinessUsers
   */
  static toDomainList(
    prismaBusinessUsers: PrismaBusinessUser[]
  ): BusinessUser[] {
    return prismaBusinessUsers.map((prismaBusinessUser) =>
      this.toDomain(prismaBusinessUser)
    );
  }
}
