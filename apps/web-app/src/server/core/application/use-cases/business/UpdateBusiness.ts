import { IBusinessRepository } from "@/server/core/domain/repositories/IBusinessRepository";
import { Business } from "@/server/core/domain/entities/Business";
import { logger } from "@/server/lib/logger";

export interface UpdateBusinessInput {
  id: string;
  title?: string;
  slug?: string;
  description?: string | null;
  domain?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  timeZone?: string;
  locale?: string;
  currency?: string;
  email?: string;
  phone?: string;
  website?: string | null;
  address?: string;
  city?: string;
  state?: string | null;
  country?: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface UpdateBusinessResult {
  success: boolean;
  business?: Business;
  error?: string;
}

export class UpdateBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(input: UpdateBusinessInput): Promise<UpdateBusinessResult> {
    try {
      logger.info(
        "UpdateBusinessUseCase",
        "system",
        `Updating business with ID: ${input.id}`
      );

      const existingBusiness = await this.businessRepository.findById(input.id);

      if (!existingBusiness) {
        return { success: false, error: "Business not found" };
      }

      // Check if slug is being updated and if it's already taken
      if (input.slug && input.slug !== existingBusiness.slug) {
        const slugTaken = await this.businessRepository.slugExists(
          input.slug,
          input.id
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
        title: input.title,
        description: input.description ?? undefined,
        email: input.email,
        phone: input.phone,
        website: input.website ?? undefined,
        address: input.address,
        city: input.city,
        state: input.state ?? undefined,
        country: input.country,
        postalCode: input.postalCode ?? undefined,
        timeZone: input.timeZone,
        locale: input.locale,
        currency: input.currency,
      });

      if (
        input.logo !== undefined ||
        input.coverImage !== undefined ||
        input.domain !== undefined
      ) {
        existingBusiness.updateBranding({
          logo: input.logo ?? undefined,
          coverImage: input.coverImage ?? undefined,
          domain: input.domain ?? undefined,
        });
      }

      if (
        input.latitude !== undefined &&
        input.latitude !== null &&
        input.longitude !== undefined &&
        input.longitude !== null
      ) {
        existingBusiness.updateLocation(input.latitude, input.longitude);
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
      logger.error(
        "UpdateBusinessUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to update business" };
    }
  }
}
