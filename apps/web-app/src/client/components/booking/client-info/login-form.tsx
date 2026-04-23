"use client";

import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { useTranslation } from "@/client/i18n";

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
        <svg viewBox="0 0 22 22" className="h-5 w-5 shrink-0">
          <path
            d="M20.64 11.2c0-.64-.06-1.25-.16-1.84H11v3.49h5.4a4.62 4.62 0 01-2 3.03v2.52h3.24c1.9-1.75 3-4.33 3-7.2z"
            fill="#4285F4"
          />
          <path
            d="M11 21c2.7 0 4.96-.9 6.62-2.42l-3.24-2.52c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H2.08v2.6A10 10 0 0011 21z"
            fill="#34A853"
          />
          <path
            d="M5.41 12.9A6.01 6.01 0 015.1 11c0-.66.11-1.3.31-1.9V6.5H2.08A10 10 0 001 11c0 1.61.38 3.13 1.08 4.5l3.33-2.6z"
            fill="#FBBC05"
          />
          <path
            d="M11 4.98c1.46 0 2.77.5 3.8 1.5L17.7 3.5A10 10 0 0011 1 10 10 0 002.08 6.5l3.33 2.6C6.2 6.74 8.4 4.98 11 4.98z"
            fill="#EA4335"
          />
        </svg>
        Continuar con Google
      </Button>
    </form>
  );
}
