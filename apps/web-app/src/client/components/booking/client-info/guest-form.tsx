"use client";

import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Checkbox } from "@/client/components/ui/checkbox";
import { useTranslation } from "@/client/i18n";

interface GuestFormProps {
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    createAccount: boolean;
  };
  error: string | null;
  isSubmitting: boolean;
  onFieldChange: (field: string, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function GuestForm({
  formData,
  error,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: GuestFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t.booking.contact.firstName}</Label>
          <Input
            id="firstName"
            type="text"
            placeholder={t.booking.contact.placeholders.firstName}
            value={formData.firstName}
            onChange={(e) => onFieldChange("firstName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t.booking.contact.lastName}</Label>
          <Input
            id="lastName"
            type="text"
            placeholder={t.booking.contact.placeholders.lastName}
            value={formData.lastName}
            onChange={(e) => onFieldChange("lastName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t.booking.contact.phoneNumber}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t.booking.contact.placeholders.phone}
            value={formData.phone}
            onChange={(e) => onFieldChange("phone", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t.booking.contact.emailAddress}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t.booking.contact.placeholders.email}
            value={formData.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="createAccount"
          checked={formData.createAccount}
          onCheckedChange={(checked) =>
            onFieldChange("createAccount", checked === true)
          }
        />
        <Label
          htmlFor="createAccount"
          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t.booking.contact.createAccountOption}
        </Label>
      </div>

      {formData.createAccount && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">
              {t.booking.contact.currentPassword}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t.booking.contact.placeholders.password}
              value={formData.password}
              onChange={(e) => onFieldChange("password", e.target.value)}
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">
              {t.booking.contact.passwordHelp}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t.booking.contact.confirmPassword}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t.booking.contact.placeholders.password}
              value={formData.confirmPassword}
              onChange={(e) => onFieldChange("confirmPassword", e.target.value)}
              required
              minLength={6}
            />
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 rounded-xl font-semibold"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? t.booking.contact.loading : t.booking.summary.continue}
      </Button>
    </form>
  );
}
