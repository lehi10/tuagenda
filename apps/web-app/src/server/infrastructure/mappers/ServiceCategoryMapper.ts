/**
 * ServiceCategory Mapper
 *
 * Maps between Prisma ServiceCategory model and Domain ServiceCategory entity.
 * This keeps the domain independent from infrastructure concerns.
 *
 * @module infrastructure/mappers
 */

import { ServiceCategory as PrismaServiceCategory } from "db";
import { ServiceCategory } from "@/server/core/domain/entities/ServiceCategory";

export class ServiceCategoryMapper {
  /**
   * Convert Prisma ServiceCategory model to Domain ServiceCategory entity
   */
  static toDomain(prismaCategory: PrismaServiceCategory): ServiceCategory {
    return new ServiceCategory({
      id: prismaCategory.id,
      businessId: prismaCategory.businessId,
      name: prismaCategory.name,
      description: prismaCategory.description,
      createdAt: prismaCategory.createdAt,
      updatedAt: prismaCategory.updatedAt,
    });
  }

  /**
   * Convert Domain ServiceCategory entity to Prisma ServiceCategory creation data
   */
  static toPrismaCreate(category: ServiceCategory) {
    const categoryObj = category.toObject();
    return {
      businessId: categoryObj.businessId,
      name: categoryObj.name,
      description: categoryObj.description,
    };
  }

  /**
   * Convert Domain ServiceCategory entity to Prisma ServiceCategory update data
   */
  static toPrismaUpdate(category: ServiceCategory) {
    const categoryObj = category.toObject();
    return {
      name: categoryObj.name,
      description: categoryObj.description,
      updatedAt: new Date(),
    };
  }

  /**
   * Convert array of Prisma ServiceCategories to array of Domain ServiceCategories
   */
  static toDomainList(
    prismaCategories: PrismaServiceCategory[]
  ): ServiceCategory[] {
    return prismaCategories.map((prismaCategory) =>
      this.toDomain(prismaCategory)
    );
  }
}
