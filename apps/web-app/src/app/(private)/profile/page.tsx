"use client";

import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/i18n";
import { PersonalInfoSection } from "@/features/profile/components/personal-info-section";
import { ProfilePhotoSection } from "@/features/profile/components/profile-photo-section";
import { SecuritySection } from "@/features/profile/components/security-section";
import { Skeleton } from "@/components/ui/skeleton";
import { logger } from "@/lib/logger";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    logger.info(
      "PROFILE_PAGE",
      user?.id || "anonymous",
      `Page loaded - loading: ${loading}`
    );
  }, [user, loading]);

  if (loading) {
    return (
      <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
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

  logger.info("PROFILE_PAGE", user.id, "Rendering profile");

  const handleUpdate = () => {
    // This will trigger a re-render when user data is updated
    // The context will automatically refresh from the database
    logger.info("PROFILE_PAGE", user.id, "Profile updated, refreshing data");
  };

  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t.pages.profile.title}
        </h1>
        <p className="text-muted-foreground">{t.pages.profile.subtitle}</p>
      </div>

      {/* Profile Sections */}
      <div className="grid gap-6">
        {/* Profile Photo Section */}
        <ProfilePhotoSection user={user} />

        {/* Personal Information Section */}
        <PersonalInfoSection user={user} onUpdate={handleUpdate} />

        {/* Security Section */}
        <SecuritySection />
      </div>
    </div>
  );
}
