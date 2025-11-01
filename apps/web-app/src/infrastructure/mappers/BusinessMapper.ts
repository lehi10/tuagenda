/**
 * Business Mapper
 *
 * Maps between Prisma Business model and Domain Business entity.
 * This keeps the domain independent from infrastructure concerns.
 *
 * @module infrastructure/mappers
 */

import { Business as PrismaBusiness } from "@/lib/db/prisma";
import { Business, BusinessStatus } from "@/core/domain/entities/Business";

export class BusinessMapper {
  /**
   * Convert Prisma Business model to Domain Business entity
   */
  static toDomain(prismaBusiness: PrismaBusiness): Business {
    return new Business({
      id: prismaBusiness.id,
      title: prismaBusiness.title,
      slug: prismaBusiness.slug,
      domain: prismaBusiness.domain,
      description: prismaBusiness.description,
      logo: prismaBusiness.logo,
      coverImage: prismaBusiness.coverImage,
      timeZone: prismaBusiness.timeZone,
      locale: prismaBusiness.locale,
      currency: prismaBusiness.currency,
      status: prismaBusiness.status as BusinessStatus,
      email: prismaBusiness.email,
      phone: prismaBusiness.phone,
      website: prismaBusiness.website,
      address: prismaBusiness.address,
      city: prismaBusiness.city,
      state: prismaBusiness.state,
      country: prismaBusiness.country,
      postalCode: prismaBusiness.postalCode,
      latitude: prismaBusiness.latitude,
      longitude: prismaBusiness.longitude,
      createdAt: prismaBusiness.createdAt,
      updatedAt: prismaBusiness.updatedAt,
    });
  }

  /**
   * Convert Domain Business entity to Prisma Business creation data
   */
  static toPrismaCreate(business: Business) {
    const businessObj = business.toObject();
    return {
      title: businessObj.title,
      slug: businessObj.slug,
      domain: businessObj.domain,
      description: businessObj.description,
      logo: businessObj.logo,
      coverImage: businessObj.coverImage,
      timeZone: businessObj.timeZone,
      locale: businessObj.locale,
      currency: businessObj.currency,
      status: businessObj.status,
      email: businessObj.email,
      phone: businessObj.phone,
      website: businessObj.website,
      address: businessObj.address,
      city: businessObj.city,
      state: businessObj.state,
      country: businessObj.country,
      postalCode: businessObj.postalCode,
      latitude: businessObj.latitude,
      longitude: businessObj.longitude,
    };
  }

  /**
   * Convert Domain Business entity to Prisma Business update data
   */
  static toPrismaUpdate(business: Business) {
    const businessObj = business.toObject();
    return {
      title: businessObj.title,
      slug: businessObj.slug,
      domain: businessObj.domain,
      description: businessObj.description,
      logo: businessObj.logo,
      coverImage: businessObj.coverImage,
      timeZone: businessObj.timeZone,
      locale: businessObj.locale,
      currency: businessObj.currency,
      status: businessObj.status,
      email: businessObj.email,
      phone: businessObj.phone,
      website: businessObj.website,
      address: businessObj.address,
      city: businessObj.city,
      state: businessObj.state,
      country: businessObj.country,
      postalCode: businessObj.postalCode,
      latitude: businessObj.latitude,
      longitude: businessObj.longitude,
      updatedAt: new Date(),
    };
  }

  /**
   * Convert array of Prisma Businesses to array of Domain Businesses
   */
  static toDomainList(prismaBusinesses: PrismaBusiness[]): Business[] {
    return prismaBusinesses.map((prismaBusiness) =>
      this.toDomain(prismaBusiness)
    );
  }
}
