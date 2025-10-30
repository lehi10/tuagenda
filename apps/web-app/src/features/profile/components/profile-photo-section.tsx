"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/i18n";
import type { User } from "@/lib/db/prisma";

interface ProfilePhotoSectionProps {
  user: User;
}

export function ProfilePhotoSection({ user }: ProfilePhotoSectionProps) {
  const { t } = useTranslation();

  // Get initials from first and last name
  const getInitials = () => {
    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.pages.profile.sections.photo}</CardTitle>
        <CardDescription>
          {t.pages.profile.sections.photoDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={user.pictureFullPath || undefined}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
}
