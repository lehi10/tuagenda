"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/client/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { useTranslation } from "@/client/i18n";
import type { UserProps } from "@/core/domain/entities/User";

interface ProfilePhotoSectionProps {
  user: UserProps;
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
