/**
 * Prisma Business Repository (Adapter)
 *
 * This is an ADAPTER in hexagonal architecture.
 * It implements the IBusinessRepository port using Prisma as the persistence mechanism.
 * The domain layer depends on the interface, not this implementation.
 *
 * @module infrastructure/repositories
 */

import { prisma } from "db";
import {
  IBusinessRepository,
  BusinessRepositoryFilters,
} from "@/server/core/domain/repositories/IBusinessRepository";
import { Business } from "@/server/core/domain/entities/Business";
import { BusinessMapper } from "../mappers/BusinessMapper";
import { Prisma, BusinessStatus as PrismaBusinessStatus } from "@prisma/client";

export class PrismaBusinessRepository implements IBusinessRepository {
  /**
   * Find a business by its ID
   */
  async findById(id: string): Promise<Business | null> {
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
  async findByIds(ids: string[]): Promise<Business[]> {
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
    const where = this.buildWhereClause(filters);
    const orderBy = this.buildOrderBy(filters);

    const prismaBusinesses = await prisma.business.findMany({
      where,
      take: filters?.limit ?? 100,
      skip: filters?.offset,
      orderBy,
    });

    return BusinessMapper.toDomainList(prismaBusinesses);
  }

  /**
   * Find all businesses and total count in a single round-trip
   */
  async findAllWithCount(
    filters?: BusinessRepositoryFilters
  ): Promise<{ businesses: Business[]; total: number }> {
    const where = this.buildWhereClause(filters);
    const orderBy = this.buildOrderBy(filters);

    const [prismaBusinesses, total] = await prisma.$transaction([
      prisma.business.findMany({
        where,
        take: filters?.limit ?? 100,
        skip: filters?.offset,
        orderBy,
      }),
      prisma.business.count({ where }),
    ]);

    return { businesses: BusinessMapper.toDomainList(prismaBusinesses), total };
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
  async delete(id: string): Promise<void> {
    await prisma.business.delete({
      where: { id },
    });
  }

  /**
   * Check if a business exists by ID
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.business.count({
      where: { id },
    });

    return count > 0;
  }

  /**
   * Check if a slug is already taken
   */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
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
    return prisma.business.count({ where: this.buildWhereClause(filters) });
  }

  private buildOrderBy(
    filters?: BusinessRepositoryFilters
  ): Prisma.BusinessOrderByWithRelationInput {
    const field = filters?.orderBy ?? "createdAt";
    const dir = filters?.orderDir ?? (field === "createdAt" ? "desc" : "asc");
    return { [field]: dir };
  }

  private buildWhereClause(
    filters?: BusinessRepositoryFilters
  ): Prisma.BusinessWhereInput {
    const where: Prisma.BusinessWhereInput = {};

    if (!filters) return where;

    if (filters.status) {
      where.status = Array.isArray(filters.status)
        ? { in: filters.status as unknown as PrismaBusinessStatus[] }
        : (filters.status as unknown as PrismaBusinessStatus);
    }

    if (filters.city) where.city = filters.city;
    if (filters.country) where.country = filters.country;

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { city: { contains: filters.search, mode: "insensitive" } },
        { country: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {
        ...(filters.createdAfter && { gte: filters.createdAfter }),
        ...(filters.createdBefore && { lte: filters.createdBefore }),
      };
    }

    return where;
  }
}
