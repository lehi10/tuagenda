/**
 * Prisma Service Repository (Adapter)
 *
 * This is an ADAPTER in hexagonal architecture.
 * It implements the IServiceRepository port using Prisma as the persistence mechanism.
 * The domain layer depends on the interface, not this implementation.
 *
 * @module infrastructure/repositories
 */

import { prisma } from "db";
import {
  IServiceRepository,
  ServiceRepositoryFilters,
} from "@/server/core/domain/repositories/IServiceRepository";
import { Service } from "@/server/core/domain/entities/Service";
import { ServiceMapper } from "../mappers/ServiceMapper";
import { Prisma } from "@prisma/client";

export class PrismaServiceRepository implements IServiceRepository {
  /**
   * Find a service by its ID
   */
  async findById(id: string): Promise<Service | null> {
    const prismaService = await prisma.service.findUnique({
      where: { id },
    });

    if (!prismaService) {
      return null;
    }

    return ServiceMapper.toDomain(prismaService);
  }

  /**
   * Find all services for a business
   */
  async findByBusinessId(
    businessId: string,
    filters?: Omit<ServiceRepositoryFilters, "businessId">
  ): Promise<Service[]> {
    const where: Prisma.ServiceWhereInput = {
      businessId,
    };

    if (filters) {
      // Category filter
      if (filters.categoryId !== undefined) {
        where.categoryId = filters.categoryId;
      }

      // Active filter
      if (filters.active !== undefined) {
        where.active = filters.active;
      }

      // Search filter
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      // Price range filters
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};
        if (filters.minPrice !== undefined) {
          where.price.gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          where.price.lte = filters.maxPrice;
        }
      }

      // Duration range filters
      if (
        filters.minDuration !== undefined ||
        filters.maxDuration !== undefined
      ) {
        where.durationMinutes = {};
        if (filters.minDuration !== undefined) {
          where.durationMinutes.gte = filters.minDuration;
        }
        if (filters.maxDuration !== undefined) {
          where.durationMinutes.lte = filters.maxDuration;
        }
      }
    }

    const prismaServices = await prisma.service.findMany({
      where,
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: [{ categoryId: "asc" }, { name: "asc" }],
    });

    return ServiceMapper.toDomainList(prismaServices);
  }

  /**
   * Find all services in a category
   */
  async findByCategoryId(categoryId: string): Promise<Service[]> {
    const prismaServices = await prisma.service.findMany({
      where: { categoryId },
      orderBy: { name: "asc" },
    });

    return ServiceMapper.toDomainList(prismaServices);
  }

  /**
   * Find a service by name within a business
   */
  async findByName(businessId: string, name: string): Promise<Service | null> {
    const prismaService = await prisma.service.findFirst({
      where: {
        businessId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (!prismaService) {
      return null;
    }

    return ServiceMapper.toDomain(prismaService);
  }

  /**
   * Create a new service
   */
  async create(service: Service): Promise<Service> {
    const data = ServiceMapper.toPrismaCreate(service);

    const createdService = await prisma.service.create({
      data,
    });

    return ServiceMapper.toDomain(createdService);
  }

  /**
   * Update an existing service
   */
  async update(service: Service): Promise<Service> {
    if (!service.id) {
      throw new Error("Service ID is required for update");
    }

    const data = ServiceMapper.toPrismaUpdate(service);

    const updatedService = await prisma.service.update({
      where: { id: service.id },
      data,
    });

    return ServiceMapper.toDomain(updatedService);
  }

  /**
   * Delete a service by ID
   */
  async delete(id: string): Promise<void> {
    await prisma.service.delete({
      where: { id },
    });
  }

  /**
   * Check if a service exists by ID
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.service.count({
      where: { id },
    });

    return count > 0;
  }

  /**
   * Check if a service name is already taken within a business
   */
  async nameExists(
    businessId: string,
    name: string,
    excludeId?: string
  ): Promise<boolean> {
    const where: Prisma.ServiceWhereInput = {
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

    const count = await prisma.service.count({
      where,
    });

    return count > 0;
  }

  /**
   * Count total services for a business
   */
  async count(
    businessId: string,
    filters?: Omit<ServiceRepositoryFilters, "businessId" | "limit" | "offset">
  ): Promise<number> {
    const where: Prisma.ServiceWhereInput = {
      businessId,
    };

    if (filters) {
      if (filters.categoryId !== undefined) {
        where.categoryId = filters.categoryId;
      }

      if (filters.active !== undefined) {
        where.active = filters.active;
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};
        if (filters.minPrice !== undefined) {
          where.price.gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          where.price.lte = filters.maxPrice;
        }
      }

      if (
        filters.minDuration !== undefined ||
        filters.maxDuration !== undefined
      ) {
        where.durationMinutes = {};
        if (filters.minDuration !== undefined) {
          where.durationMinutes.gte = filters.minDuration;
        }
        if (filters.maxDuration !== undefined) {
          where.durationMinutes.lte = filters.maxDuration;
        }
      }
    }

    return await prisma.service.count({ where });
  }

  /**
   * Get services by multiple IDs
   */
  async findByIds(ids: string[]): Promise<Service[]> {
    const prismaServices = await prisma.service.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return ServiceMapper.toDomainList(prismaServices);
  }
}
