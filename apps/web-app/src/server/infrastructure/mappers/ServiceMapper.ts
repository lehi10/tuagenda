/**
 * Service Mapper
 *
 * Maps between Prisma Service model and Domain Service entity.
 * This keeps the domain independent from infrastructure concerns.
 *
 * @module infrastructure/mappers
 */

import { Service as PrismaService } from "db";
import { Service } from "@/server/core/domain/entities/Service";
import Decimal from "decimal.js";

export class ServiceMapper {
  /**
   * Convert Prisma Service model to Domain Service entity
   */
  static toDomain(prismaService: PrismaService): Service {
    return new Service({
      id: prismaService.id,
      businessId: prismaService.businessId,
      categoryId: prismaService.categoryId,
      name: prismaService.name,
      description: prismaService.description,
      price: new Decimal(prismaService.price.toString()),
      durationMinutes: prismaService.durationMinutes,
      active: prismaService.active,
      isVirtual: prismaService.isVirtual,
      requiresOnlinePayment: prismaService.requiresOnlinePayment,
      images: prismaService.images,
      createdAt: prismaService.createdAt,
      updatedAt: prismaService.updatedAt,
    });
  }

  /**
   * Convert Domain Service entity to Prisma Service creation data
   */
  static toPrismaCreate(service: Service) {
    const serviceObj = service.toObject();
    return {
      businessId: serviceObj.businessId,
      categoryId: serviceObj.categoryId,
      name: serviceObj.name,
      description: serviceObj.description,
      price: serviceObj.price.toNumber(),
      durationMinutes: serviceObj.durationMinutes,
      active: serviceObj.active,
      isVirtual: serviceObj.isVirtual ?? false,
      requiresOnlinePayment: serviceObj.requiresOnlinePayment ?? false,
    };
  }

  /**
   * Convert Domain Service entity to Prisma Service update data
   */
  static toPrismaUpdate(service: Service) {
    const serviceObj = service.toObject();
    return {
      categoryId: serviceObj.categoryId,
      name: serviceObj.name,
      description: serviceObj.description,
      price: serviceObj.price.toNumber(),
      durationMinutes: serviceObj.durationMinutes,
      active: serviceObj.active,
      isVirtual: serviceObj.isVirtual ?? false,
      requiresOnlinePayment: serviceObj.requiresOnlinePayment ?? false,
      updatedAt: new Date(),
    };
  }

  /**
   * Convert array of Prisma Services to array of Domain Services
   */
  static toDomainList(prismaServices: PrismaService[]): Service[] {
    return prismaServices.map((prismaService) => this.toDomain(prismaService));
  }
}
