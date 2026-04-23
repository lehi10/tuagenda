"use client";

import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { useTranslation } from "@/client/i18n";
import { GoogleIcon } from "@/client/components/shared";

interface LoginFormProps {
  formData: { email: string; password: string };
  error: string | null;
  isSubmitting: boolean;
  onFieldChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSocialLogin: (provider: string) => void;
}

export function LoginForm({
  formData,
  error,
  isSubmitting,
  onFieldChange,
  onSubmit,
  onSocialLogin,
}: LoginFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="loginEmail">{t.booking.contact.emailAddress}</Label>
        <Input
          id="loginEmail"
          type="email"
          placeholder={t.booking.contact.placeholders.email}
          value={formData.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="loginPassword">
          {t.booking.contact.currentPassword}
        </Label>
        <Input
          id="loginPassword"
          type="password"
          placeholder={t.booking.contact.placeholders.password}
          value={formData.password}
          onChange={(e) => onFieldChange("password", e.target.value)}
          required
          minLength={6}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl font-semibold"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? t.booking.contact.loading : t.auth.login}
      </Button>

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t.auth.orContinueWith}
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 rounded-xl font-semibold gap-3"
        onClick={() => onSocialLogin("Google")}
      >
        <GoogleIcon className="h-5 w-5 shrink-0" />
        Continuar con Google
      </Button>
    </form>
  );
}
