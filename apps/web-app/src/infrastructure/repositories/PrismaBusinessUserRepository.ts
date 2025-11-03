/**
 * Prisma BusinessUser Repository (Adapter)
 *
 * This is an ADAPTER in hexagonal architecture.
 * It implements the IBusinessUserRepository port using Prisma as the persistence mechanism.
 * The domain layer depends on the interface, not this implementation.
 *
 * @module infrastructure/repositories
 */

import { prisma } from "@/lib/db/prisma";
import {
  IBusinessUserRepository,
  BusinessUserRepositoryFilters,
} from "@/core/domain/repositories/IBusinessUserRepository";
import { BusinessUser, BusinessRole } from "@/core/domain/entities/BusinessUser";
import { BusinessUserMapper } from "../mappers/BusinessUserMapper";
import { Prisma, BusinessRole as PrismaBusinessRole } from "@prisma/client";

export class PrismaBusinessUserRepository implements IBusinessUserRepository {
  /**
   * Find a business-user relationship by ID
   */
  async findById(id: number): Promise<BusinessUser | null> {
    const prismaBusinessUser = await prisma.businessUser.findUnique({
      where: { id },
    });

    if (!prismaBusinessUser) {
      return null;
    }

    return BusinessUserMapper.toDomain(prismaBusinessUser);
  }

  /**
   * Find a business-user relationship by user and business IDs
   */
  async findByUserAndBusiness(
    userId: string,
    businessId: number
  ): Promise<BusinessUser | null> {
    const prismaBusinessUser = await prisma.businessUser.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    if (!prismaBusinessUser) {
      return null;
    }

    return BusinessUserMapper.toDomain(prismaBusinessUser);
  }

  /**
   * Find all users associated with a business
   */
  async findByBusiness(
    businessId: number,
    filters?: BusinessUserRepositoryFilters
  ): Promise<BusinessUser[]> {
    const where: Prisma.BusinessUserWhereInput = {
      businessId,
    };

    this.applyFilters(where, filters);

    const prismaBusinessUsers = await prisma.businessUser.findMany({
      where,
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: "desc" },
    });

    return BusinessUserMapper.toDomainList(prismaBusinessUsers);
  }

  /**
   * Find all businesses associated with a user
   */
  async findByUser(
    userId: string,
    filters?: BusinessUserRepositoryFilters
  ): Promise<BusinessUser[]> {
    const where: Prisma.BusinessUserWhereInput = {
      userId,
    };

    this.applyFilters(where, filters);

    const prismaBusinessUsers = await prisma.businessUser.findMany({
      where,
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: "desc" },
    });

    return BusinessUserMapper.toDomainList(prismaBusinessUsers);
  }

  /**
   * Create a new business-user relationship
   */
  async create(businessUser: BusinessUser): Promise<BusinessUser> {
    const data = BusinessUserMapper.toPrismaCreate(businessUser);

    const created = await prisma.businessUser.create({
      data,
    });

    return BusinessUserMapper.toDomain(created);
  }

  /**
   * Update an existing business-user relationship
   */
  async update(businessUser: BusinessUser): Promise<BusinessUser> {
    if (!businessUser.id) {
      throw new Error("BusinessUser ID is required for update");
    }

    const data = BusinessUserMapper.toPrismaUpdate(businessUser);

    const updated = await prisma.businessUser.update({
      where: { id: businessUser.id },
      data,
    });

    return BusinessUserMapper.toDomain(updated);
  }

  /**
   * Delete a business-user relationship by ID
   */
  async delete(id: number): Promise<void> {
    await prisma.businessUser.delete({
      where: { id },
    });
  }

  /**
   * Delete a business-user relationship by user and business IDs
   */
  async deleteByUserAndBusiness(
    userId: string,
    businessId: number
  ): Promise<void> {
    await prisma.businessUser.delete({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });
  }

  /**
   * Check if a business-user relationship exists
   */
  async exists(userId: string, businessId: number): Promise<boolean> {
    const count = await prisma.businessUser.count({
      where: {
        userId,
        businessId,
      },
    });

    return count > 0;
  }

  /**
   * Count total business-user relationships with optional filters
   */
  async count(filters?: BusinessUserRepositoryFilters): Promise<number> {
    const where: Prisma.BusinessUserWhereInput = {};

    this.applyFilters(where, filters);

    return await prisma.businessUser.count({ where });
  }

  /**
   * Get all managers for a business
   */
  async findManagersByBusiness(businessId: number): Promise<BusinessUser[]> {
    const prismaBusinessUsers = await prisma.businessUser.findMany({
      where: {
        businessId,
        role: PrismaBusinessRole.MANAGER,
      },
      orderBy: { createdAt: "desc" },
    });

    return BusinessUserMapper.toDomainList(prismaBusinessUsers);
  }

  /**
   * Get all employees for a business
   */
  async findEmployeesByBusiness(businessId: number): Promise<BusinessUser[]> {
    const prismaBusinessUsers = await prisma.businessUser.findMany({
      where: {
        businessId,
        role: PrismaBusinessRole.EMPLOYEE,
      },
      orderBy: { createdAt: "desc" },
    });

    return BusinessUserMapper.toDomainList(prismaBusinessUsers);
  }

  /**
   * Apply filters to the where clause
   */
  private applyFilters(
    where: Prisma.BusinessUserWhereInput,
    filters?: BusinessUserRepositoryFilters
  ): void {
    if (!filters) return;

    // Role filter
    if (filters.role) {
      if (Array.isArray(filters.role)) {
        where.role = {
          in: filters.role as PrismaBusinessRole[],
        };
      } else {
        where.role = filters.role as PrismaBusinessRole;
      }
    }

    // Date filters
    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};

      if (filters.createdAfter) {
        where.createdAt.gte = filters.createdAfter;
      }

      if (filters.createdBefore) {
        where.createdAt.lte = filters.createdBefore;
      }
    }
  }
}
