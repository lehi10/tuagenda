import type { BusinessNotificationSettings } from "notifications";
import type { IBusinessRepository } from "@/server/core/domain/repositories/IBusinessRepository";
import { Business } from "@/server/core/domain/entities/Business";
import { logger } from "@/server/lib/logger";

export interface UpdateNotificationSettingsInput {
  id: string;
  notificationSettings: BusinessNotificationSettings | null;
}

export interface UpdateNotificationSettingsResult {
  success: boolean;
  business?: Business;
  error?: string;
}

export class UpdateNotificationSettingsUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(
    input: UpdateNotificationSettingsInput
  ): Promise<UpdateNotificationSettingsResult> {
    try {
      logger.info(
        "UpdateNotificationSettingsUseCase",
        "system",
        `Updating notification settings for business: ${input.id}`
      );

      const business = await this.businessRepository.findById(input.id);

      if (!business) {
        return { success: false, error: "Business not found" };
      }

      business.updateNotificationSettings(input.notificationSettings);

      // TODO: In the future, custom templates per business will be resolved here
      // before persisting, fetching the business's template overrides from the DB.

      const updated = await this.businessRepository.update(business);

      logger.info(
        "UpdateNotificationSettingsUseCase",
        "system",
        `Notification settings updated for business: ${input.id}`
      );

      return { success: true, business: updated };
    } catch (error) {
      logger.error(
        "UpdateNotificationSettingsUseCase",
        "system",
        `Failed to update notification settings for business: ${input.id} — ${error}`
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update notification settings",
      };
    }
  }
}
