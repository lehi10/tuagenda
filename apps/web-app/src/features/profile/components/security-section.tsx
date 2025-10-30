"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { useTranslation } from "@/i18n";

import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/user.schema";
import { changePassword } from "@/actions/user/change-password.action";
import { logger } from "@/lib/logger";
import { authService } from "@/lib/auth/auth-service";

export function SecuritySection() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    logger.info("SECURITY", "anonymous", "Submitting password change");
    setIsLoading(true);

    try {
      const result = await changePassword(data);

      if (result.success) {
        toast.success(t.pages.profile.messages.passwordChanged);
        logger.info("SECURITY", "anonymous", "Password changed successfully");
        reset(); // Clear form on success
      } else {
        toast.error(result.error);
        logger.error(
          "SECURITY",
          "anonymous",
          `Password change failed: ${result.error}`
        );
      }
    } catch (error) {
      logger.error(
        "SECURITY",
        "anonymous",
        `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
      );
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  const authProviders = authService.getCurrentUser()?.providerData;

  // Memoize provider parsing to avoid recalculating on every render
  const { providerIds, primaryProvider, providerName } = useMemo(() => {
    const ids = (authProviders || [])
      .map((p: any) =>
        typeof p === "string" ? p : p?.providerId || p?.provider || ""
      )
      .filter(Boolean) as string[];

    const primary = ids[0] ?? "";

    const getProviderFriendlyName = (id: string) => {
      const v = id.toLowerCase();
      if (v.includes("google")) return "Google";
      if (v.includes("facebook")) return "Facebook";
      if (v.includes("github")) return "GitHub";
      if (v.includes("apple")) return "Apple";
      if (v === "password") return "Contraseña";
      return id;
    };

    const name = primary ? getProviderFriendlyName(primary) : "";

    return { providerIds: ids, primaryProvider: primary, providerName: name };
  }, [authProviders]);

  if (providerIds.length > 0 && primaryProvider !== "password") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.pages.profile.sections.security}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <p className="text-sm text-muted-foreground">
              No puedes modificar la contraseña porque inicias sesión con{" "}
              <span className="font-bold">{providerName}</span>.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.pages.profile.sections.security}</CardTitle>
        <CardDescription>
          {t.pages.profile.sections.securityDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <Field>
            <FieldLabel>
              {t.pages.profile.fields.currentPassword}{" "}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                {...register("currentPassword")}
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter your current password"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isLoading}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <FieldError>{errors.currentPassword?.message}</FieldError>
          </Field>

          {/* New Password */}
          <Field>
            <FieldLabel>
              {t.pages.profile.fields.newPassword}{" "}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                {...register("newPassword")}
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <FieldDescription>
              {t.pages.profile.fields.newPasswordHelp}
            </FieldDescription>
            <FieldError>{errors.newPassword?.message}</FieldError>
          </Field>

          {/* Confirm Password */}
          <Field>
            <FieldLabel>
              {t.pages.profile.fields.confirmPassword}{" "}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </Field>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.pages.profile.actions.changePassword}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
