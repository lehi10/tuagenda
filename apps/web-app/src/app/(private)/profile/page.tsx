"use client";

import { useAuth } from "@/client/contexts/auth-context";
import { useTranslation } from "@/client/i18n";
import { PersonalInfoSection } from "@/client/features/profile/components/personal-info-section";
import { ProfilePhotoSection } from "@/client/features/profile/components/profile-photo-section";
import { SecuritySection } from "@/client/features/profile/components/security-section";
import { Skeleton } from "@/client/components/ui/skeleton";
import { logger } from "@/shared/lib/logger";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[260px_1fr]">
          <Skeleton className="h-64 w-full" />
          <div className="grid gap-4 sm:gap-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    logger.error("PROFILE_PAGE", "anonymous", "No user found");
    return (
      <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Not authenticated</h1>
          <p className="text-muted-foreground mt-2">
            Please sign in to view your profile
          </p>
        </div>
      </div>
    );
  }

  const handleUpdate = async () => {
    logger.info("PROFILE_PAGE", user.id, "Profile updated, refreshing data");
    await refreshUser();
  };

  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
          {t.pages.profile.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t.pages.profile.subtitle}
        </p>
      </div>

      {/* Profile Sections */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
        {/* Profile Photo Section */}
        <ProfilePhotoSection user={user} onUpdate={handleUpdate} />

        {/* Right column: personal info + security */}
        <div className="grid gap-4 sm:gap-6">
          <PersonalInfoSection user={user} onUpdate={handleUpdate} />
          <SecuritySection />
        </div>
      </div>
    </div>
  );
}
