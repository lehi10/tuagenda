/**
 * Create Business Use Case
 *
 * This use case handles the creation of a new business in the system.
 * It validates input, checks for existing slug, creates the domain entity,
 * and persists it using the repository.
 *
 * @module core/application/use-cases/business
 */

import { IBusinessRepository } from "@/core/domain/repositories/IBusinessRepository";
import { Business } from "@/core/domain/entities/Business";
import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Input schema for creating a business
 */
const createBusinessSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  description: z.string().optional().nullable(),
  domain: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  timeZone: z.string().min(1, "TimeZone is required"),
  locale: z.string().min(1, "Locale is required"),
  currency: z.string().min(1, "Currency is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  website: z.string().optional().nullable(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional().nullable(),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;

export interface CreateBusinessResult {
  success: boolean;
  business?: Business;
  error?: string;
}

/**
 * Create Business Use Case
 *
 * Business logic for creating a new business:
 * 1. Validate input data
 * 2. Check if slug already exists
 * 3. Create domain entity
 * 4. Persist using repository
 */
export class CreateBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(input: unknown): Promise<CreateBusinessResult> {
    try {
      // 1. Validate input
      logger.info("CreateBusinessUseCase", "system", "Validating input data");
      const validatedData = createBusinessSchema.parse(input);

      logger.info(
        "CreateBusinessUseCase",
        "system",
        `Creating business with title: ${validatedData.title}, slug: ${validatedData.slug}`
      );

      // 2. Check if slug already exists
      const slugExists = await this.businessRepository.slugExists(
        validatedData.slug
      );

      if (slugExists) {
        logger.error(
          "CreateBusinessUseCase",
          "system",
          `Slug ${validatedData.slug} is already taken`
        );
        return {
          success: false,
          error: "A business with this slug already exists",
        };
      }

      // 3. Create domain entity
      logger.info(
        "CreateBusinessUseCase",
        "system",
        "Creating Business domain entity"
      );

      const business = new Business({
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        domain: validatedData.domain,
        logo: validatedData.logo,
        coverImage: validatedData.coverImage,
        timeZone: validatedData.timeZone,
        locale: validatedData.locale,
        currency: validatedData.currency,
        email: validatedData.email,
        phone: validatedData.phone,
        website: validatedData.website,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        country: validatedData.country,
        postalCode: validatedData.postalCode,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
      });

      // 4. Persist using repository
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
      if (error instanceof z.ZodError) {
        logger.error(
          "CreateBusinessUseCase",
          "system",
          `Validation error: ${JSON.stringify(error.issues)}`
        );
        return {
          success: false,
          error: "Invalid input data: " + error.issues[0].message,
        };
      }

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
