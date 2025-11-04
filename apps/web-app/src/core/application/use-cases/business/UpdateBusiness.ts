import { IBusinessRepository } from "@/core/domain/repositories/IBusinessRepository";
import { Business } from "@/core/domain/entities/Business";
import { z } from "zod";
import { logger } from "@/lib/logger";

const updateBusinessSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  domain: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  timeZone: z.string().optional(),
  locale: z.string().optional(),
  currency: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().optional().nullable(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional().nullable(),
  country: z.string().optional(),
  postalCode: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;

export interface UpdateBusinessResult {
  success: boolean;
  business?: Business;
  error?: string;
}

export class UpdateBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(input: unknown): Promise<UpdateBusinessResult> {
    try {
      const validatedData = updateBusinessSchema.parse(input);
      logger.info(
        "UpdateBusinessUseCase",
        "system",
        `Updating business with ID: ${validatedData.id}`
      );

      const existingBusiness = await this.businessRepository.findById(
        validatedData.id
      );

      if (!existingBusiness) {
        return { success: false, error: "Business not found" };
      }

      // Check if slug is being updated and if it's already taken
      if (validatedData.slug && validatedData.slug !== existingBusiness.slug) {
        const slugTaken = await this.businessRepository.slugExists(
          validatedData.slug,
          validatedData.id
        );
        if (slugTaken) {
          return {
            success: false,
            error: "A business with this slug already exists",
          };
        }
      }

      // Update the business entity
      existingBusiness.updateInfo({
        title: validatedData.title,
        description: validatedData.description ?? undefined,
        email: validatedData.email,
        phone: validatedData.phone,
        website: validatedData.website ?? undefined,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state ?? undefined,
        country: validatedData.country,
        postalCode: validatedData.postalCode ?? undefined,
        timeZone: validatedData.timeZone,
        locale: validatedData.locale,
        currency: validatedData.currency,
      });

      if (
        validatedData.logo !== undefined ||
        validatedData.coverImage !== undefined ||
        validatedData.domain !== undefined
      ) {
        existingBusiness.updateBranding({
          logo: validatedData.logo ?? undefined,
          coverImage: validatedData.coverImage ?? undefined,
          domain: validatedData.domain ?? undefined,
        });
      }

      if (
        validatedData.latitude !== undefined &&
        validatedData.latitude !== null &&
        validatedData.longitude !== undefined &&
        validatedData.longitude !== null
      ) {
        existingBusiness.updateLocation(
          validatedData.latitude,
          validatedData.longitude
        );
      }

      const updatedBusiness =
        await this.businessRepository.update(existingBusiness);

      logger.info(
        "UpdateBusinessUseCase",
        "system",
        "Business updated successfully"
      );
      return { success: true, business: updatedBusiness };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "Invalid input: " + error.issues[0].message,
        };
      }
      logger.error(
        "UpdateBusinessUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to update business" };
    }
  }
}
