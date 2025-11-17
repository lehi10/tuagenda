/**
 * Create Business Use Case
 *
 * This use case handles the creation of a new business in the system.
 * It checks for existing slug, creates the domain entity,
 * and persists it using the repository.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 *
 * @module core/application/use-cases/business
 */

import { IBusinessRepository } from "@/server/core/domain/repositories/IBusinessRepository";
import { Business } from "@/server/core/domain/entities/Business";
import { logger } from "@/server/lib/logger";

export interface CreateBusinessInput {
  title: string;
  slug: string;
  description?: string | null;
  domain?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  timeZone: string;
  locale: string;
  currency: string;
  email: string;
  phone: string;
  website?: string | null;
  address: string;
  city: string;
  state?: string | null;
  country: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CreateBusinessResult {
  success: boolean;
  business?: Business;
  error?: string;
}

/**
 * Create Business Use Case
 *
 * Business logic for creating a new business:
 * 1. Check if slug already exists
 * 2. Create domain entity
 * 3. Persist using repository
 */
export class CreateBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(input: CreateBusinessInput): Promise<CreateBusinessResult> {
    try {
      logger.info(
        "CreateBusinessUseCase",
        "system",
        `Creating business with title: ${input.title}, slug: ${input.slug}`
      );

      // 1. Check if slug already exists
      const slugExists = await this.businessRepository.slugExists(input.slug);

      if (slugExists) {
        logger.error(
          "CreateBusinessUseCase",
          "system",
          `Slug ${input.slug} is already taken`
        );
        return {
          success: false,
          error: "A business with this slug already exists",
        };
      }

      // 2. Create domain entity
      logger.info(
        "CreateBusinessUseCase",
        "system",
        "Creating Business domain entity"
      );

      const business = new Business({
        title: input.title,
        slug: input.slug,
        description: input.description,
        domain: input.domain,
        logo: input.logo,
        coverImage: input.coverImage,
        timeZone: input.timeZone,
        locale: input.locale,
        currency: input.currency,
        email: input.email,
        phone: input.phone,
        website: input.website,
        address: input.address,
        city: input.city,
        state: input.state,
        country: input.country,
        postalCode: input.postalCode,
        latitude: input.latitude,
        longitude: input.longitude,
      });

      // 3. Persist using repository
      logger.info(
        "CreateBusinessUseCase",
        "system",
        "Persisting business to database"
      );

      const createdBusiness = await this.businessRepository.create(business);

      logger.info(
        "CreateBusinessUseCase",
        "system",
        `Business created successfully with ID: ${createdBusiness.id}`
      );

      return {
        success: true,
        business: createdBusiness,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "CreateBusinessUseCase",
          "system",
          `Error creating business: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "CreateBusinessUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while creating the business",
      };
    }
  }
}
