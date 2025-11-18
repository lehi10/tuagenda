/**
 * Email Notice Component
 *
 * Displays an informational notice about confirmation email.
 */

import { Card, CardContent } from "@/client/components/ui/card";
import { Mail } from "lucide-react";
import { useTranslation } from "@/client/i18n";

interface EmailNoticeProps {
  email: string;
}

export function EmailNotice({ email }: EmailNoticeProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {t.booking.confirmation.confirmationSent}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              {t.booking.confirmation.confirmationEmail}{" "}
              <strong>{email}</strong>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
