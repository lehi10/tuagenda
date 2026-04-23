"use client";

import { Button } from "@/client/components/ui/button";
import { useTranslation } from "@/client/i18n";

interface AuthenticatedUserCardProps {
  user: {
    firstName: string;
    lastName?: string | null;
    email: string;
    phone?: string | null;
  };
  isSubmitting: boolean;
  onContinue: () => void;
}

export function AuthenticatedUserCard({
  user,
  isSubmitting,
  onContinue,
}: AuthenticatedUserCardProps) {
  const { t } = useTranslation();
  return (
    <>
      <div className="rounded-2xl border bg-primary/5 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
            {user.firstName[0]}
            {user.lastName?.[0] ?? ""}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
            {user.phone && (
              <p className="text-sm text-muted-foreground">{user.phone}</p>
            )}
          </div>
        </div>
      </div>
      <Button
        className="w-full h-12 rounded-xl font-semibold"
        size="lg"
        onClick={onContinue}
        disabled={isSubmitting}
      >
        {isSubmitting ? t.booking.contact.loading : t.booking.summary.continue}
      </Button>
    </>
  );
}
