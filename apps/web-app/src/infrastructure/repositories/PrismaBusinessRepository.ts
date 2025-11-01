/**
 * Prisma Business Repository (Adapter)
 *
 * This is an ADAPTER in hexagonal architecture.
 * It implements the IBusinessRepository port using Prisma as the persistence mechanism.
 * The domain layer depends on the interface, not this implementation.
 *
 * @module infrastructure/repositories
 */

import { prisma } from "@/lib/db/prisma";
import {
  IBusinessRepository,
  BusinessRepositoryFilters,
} from "@/core/domain/repositories/IBusinessRepository";
import { Business } from "@/core/domain/entities/Business";
import { BusinessMapper } from "../mappers/BusinessMapper";
import { Prisma, BusinessStatus as PrismaBusinessStatus } from "@prisma/client";

export class PrismaBusinessRepository implements IBusinessRepository {
  /**
   * Find a business by its ID
   */
  async findById(id: number): Promise<Business | null> {
    const prismaBusiness = await prisma.business.findUnique({
      where: { id },
    });

    if (!prismaBusiness) {
      return null;
    }

    return BusinessMapper.toDomain(prismaBusiness);
  }

  /**
   * Find a business by its slug
   */
  async findBySlug(slug: string): Promise<Business | null> {
    const prismaBusiness = await prisma.business.findUnique({
      where: { slug },
    });

    if (!prismaBusiness) {
      return null;
    }

    return BusinessMapper.toDomain(prismaBusiness);
  }

  /**
   * Find multiple businesses by their IDs
   */
  async findByIds(ids: number[]): Promise<Business[]> {
    const prismaBusinesses = await prisma.business.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return BusinessMapper.toDomainList(prismaBusinesses);
  }

  /**
   * Find all businesses with optional filtering
   */
  async findAll(filters?: BusinessRepositoryFilters): Promise<Business[]> {
    const where: Prisma.BusinessWhereInput = {};

    if (filters) {
      // Status filter - Domain enums use same string values as Prisma
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          where.status = {
            in: filters.status as unknown as PrismaBusinessStatus[],
          };
        } else {
          where.status = filters.status as unknown as PrismaBusinessStatus;
        }
      }

      // City filter
      if (filters.city) {
        where.city = filters.city;
      }

      // Country filter
      if (filters.country) {
        where.country = filters.country;
      }

      // Search filter (searches in title, email, city, country)
      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { email: { contains: filters.search, mode: "insensitive" } },
          { city: { contains: filters.search, mode: "insensitive" } },
          { country: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      // Date range filters
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

    const prismaBusinesses = await prisma.business.findMany({
      where,
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: "desc" },
    });

    return BusinessMapper.toDomainList(prismaBusinesses);
  }

  /**
   * Create a new business
   */
  async create(business: Business): Promise<Business> {
    const data = BusinessMapper.toPrismaCreate(business);

    const createdBusiness = await prisma.business.create({
      data,
    });

    return BusinessMapper.toDomain(createdBusiness);
  }

  /**
   * Update an existing business
   */
  async update(business: Business): Promise<Business> {
    if (!business.id) {
      throw new Error("Business ID is required for update");
    }

    const data = BusinessMapper.toPrismaUpdate(business);

    const updatedBusiness = await prisma.business.update({
      where: { id: business.id },
      data,
    });

    return BusinessMapper.toDomain(updatedBusiness);
  }

  /**
   * Delete a business by ID
   */
  async delete(id: number): Promise<void> {
    await prisma.business.delete({
      where: { id },
    });
  }

  /**
   * Check if a business exists by ID
   */
  async exists(id: number): Promise<boolean> {
    const count = await prisma.business.count({
      where: { id },
    });

    return count > 0;
  }

  /**
   * Check if a slug is already taken
   */
  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const where: Prisma.BusinessWhereInput = {
      slug,
    };

    if (excludeId !== undefined) {
      where.id = {
        not: excludeId,
      };
    }

    const count = await prisma.business.count({
      where,
    });

    return count > 0;
  }

  /**
   * Count total businesses with optional filters
   */
  async count(filters?: BusinessRepositoryFilters): Promise<number> {
    const where: Prisma.BusinessWhereInput = {};

    if (filters) {
      // Status filter - Domain enums use same string values as Prisma
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          where.status = {
            in: filters.status as unknown as PrismaBusinessStatus[],
          };
        } else {
          where.status = filters.status as unknown as PrismaBusinessStatus;
        }
      }

      if (filters.city) {
        where.city = filters.city;
      }

      if (filters.country) {
        where.country = filters.country;
      }

      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { email: { contains: filters.search, mode: "insensitive" } },
          { city: { contains: filters.search, mode: "insensitive" } },
          { country: { contains: filters.search, mode: "insensitive" } },
        ];
      }

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

    return await prisma.business.count({ where });
  }
}
