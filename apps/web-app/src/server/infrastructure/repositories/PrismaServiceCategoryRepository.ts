/**
 * Prisma ServiceCategory Repository (Adapter)
 *
 * This is an ADAPTER in hexagonal architecture.
 * It implements the IServiceCategoryRepository port using Prisma as the persistence mechanism.
 * The domain layer depends on the interface, not this implementation.
 *
 * @module infrastructure/repositories
 */

import { prisma } from "db";
import {
  IServiceCategoryRepository,
  ServiceCategoryRepositoryFilters,
} from "@/server/core/domain/repositories/IServiceCategoryRepository";
import { ServiceCategory } from "@/server/core/domain/entities/ServiceCategory";
import { ServiceCategoryMapper } from "../mappers/ServiceCategoryMapper";
import { Prisma } from "@prisma/client";

export class PrismaServiceCategoryRepository
  implements IServiceCategoryRepository
{
  /**
   * Find a service category by its ID
   */
  async findById(id: string): Promise<ServiceCategory | null> {
    const prismaCategory = await prisma.serviceCategory.findUnique({
      where: { id },
    });

    if (!prismaCategory) {
      return null;
    }

    return ServiceCategoryMapper.toDomain(prismaCategory);
  }

  /**
   * Find all service categories for a business
   */
  async findByBusinessId(
    businessId: string,
    filters?: Omit<ServiceCategoryRepositoryFilters, "businessId">
  ): Promise<ServiceCategory[]> {
    const where: Prisma.ServiceCategoryWhereInput = {
      businessId,
    };

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const prismaCategories = await prisma.serviceCategory.findMany({
      where,
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { name: "asc" },
    });

    return ServiceCategoryMapper.toDomainList(prismaCategories);
  }

  /**
   * Find a service category by name within a business
   */
  async findByName(
    businessId: string,
    name: string
  ): Promise<ServiceCategory | null> {
    const prismaCategory = await prisma.serviceCategory.findFirst({
      where: {
        businessId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (!prismaCategory) {
      return null;
    }

    return ServiceCategoryMapper.toDomain(prismaCategory);
  }

  /**
   * Create a new service category
   */
  async create(category: ServiceCategory): Promise<ServiceCategory> {
    const data = ServiceCategoryMapper.toPrismaCreate(category);

    const createdCategory = await prisma.serviceCategory.create({
      data,
    });

    return ServiceCategoryMapper.toDomain(createdCategory);
  }

  /**
   * Update an existing service category
   */
  async update(category: ServiceCategory): Promise<ServiceCategory> {
    if (!category.id) {
      throw new Error("ServiceCategory ID is required for update");
    }

    const data = ServiceCategoryMapper.toPrismaUpdate(category);

    const updatedCategory = await prisma.serviceCategory.update({
      where: { id: category.id },
      data,
    });

    return ServiceCategoryMapper.toDomain(updatedCategory);
  }

  /**
   * Delete a service category by ID
   */
  async delete(id: string): Promise<void> {
    await prisma.serviceCategory.delete({
      where: { id },
    });
  }

  /**
   * Check if a service category exists by ID
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.serviceCategory.count({
      where: { id },
    });

    return count > 0;
  }

  /**
   * Check if a category name is already taken within a business
   */
  async nameExists(
    businessId: string,
    name: string,
    excludeId?: string
  ): Promise<boolean> {
    const where: Prisma.ServiceCategoryWhereInput = {
      businessId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    };

    if (excludeId !== undefined) {
      where.id = {
        not: excludeId,
      };
    }

    const count = await prisma.serviceCategory.count({
      where,
    });

    return count > 0;
  }

  /**
   * Count total service categories for a business
   */
  async count(businessId: string): Promise<number> {
    return await prisma.serviceCategory.count({
      where: { businessId },
    });
  }
}
