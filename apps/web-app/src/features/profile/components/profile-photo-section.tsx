"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User } from "@/lib/db/prisma";

interface ProfilePhotoSectionProps {
  user: User;
}

export function ProfilePhotoSection({ user }: ProfilePhotoSectionProps) {
  // Get initials from first and last name
  const getInitials = () => {
    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
        <CardDescription>
          Your profile photo is displayed across TuAgenda
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="h-32 w-32">
          <AvatarImage
            src={user.pictureFullPath || undefined}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <AvatarFallback className="text-4xl">{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Photo management will be available soon
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
