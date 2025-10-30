"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { useTranslation } from "@/i18n";

import {
  updateProfilePersonalInfoSchema,
  type UpdateProfilePersonalInfoInput,
} from "@/lib/validations/user.schema";
import { updateUserProfile } from "@/actions/user/update-user.action";
import { logger } from "@/lib/logger";
import type { User } from "@/lib/db/prisma";

interface PersonalInfoSectionProps {
  user: User;
  onUpdate?: () => void;
}

export function PersonalInfoSection({
  user,
  onUpdate,
}: PersonalInfoSectionProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateProfilePersonalInfoInput>({
    resolver: zodResolver(updateProfilePersonalInfoSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      birthday: user.birthday ? new Date(user.birthday) : undefined,
      countryCode: user.countryCode || "+51",
      phone: user.phone || "",
      timeZone: user.timeZone || "America/Lima",
    },
  });

  const countryCode = watch("countryCode");
  const timeZone = watch("timeZone");

  const onSubmit = async (data: UpdateProfilePersonalInfoInput) => {
    logger.info("PERSONAL_INFO", user.id, "Submitting form");
    setIsLoading(true);

    try {
      const result = await updateUserProfile(user.id, data);

      if (result.success) {
        toast.success(t.pages.profile.messages.profileUpdated);
        logger.info("PERSONAL_INFO", user.id, "Profile updated successfully");
        onUpdate?.();
      } else {
        toast.error(result.error);
        logger.error(
          "PERSONAL_INFO",
          user.id,
          `Update failed: ${result.error}`
        );
      }
    } catch (error) {
      logger.error(
        "PERSONAL_INFO",
        user.id,
        `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
      );
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.pages.profile.sections.personalInfo}</CardTitle>
        <CardDescription>
          {t.pages.profile.sections.personalInfoDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>
                {t.pages.profile.fields.firstName}{" "}
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...register("firstName")}
                placeholder="John"
                disabled={isLoading}
              />
              <FieldError>{errors.firstName?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>
                {t.pages.profile.fields.lastName}{" "}
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...register("lastName")}
                placeholder="Doe"
                disabled={isLoading}
              />
              <FieldError>{errors.lastName?.message}</FieldError>
            </Field>
          </div>

          {/* Email (readonly) */}
          <Field>
            <FieldLabel>{t.pages.profile.fields.email}</FieldLabel>
            <Input value={user.email} disabled readOnly />
            <FieldDescription>
              {t.pages.profile.fields.emailReadonly}
            </FieldDescription>
          </Field>

          {/* Phone Number with Country Code */}
          <Field>
            <FieldLabel>{t.pages.profile.fields.phone}</FieldLabel>
            <div className="flex gap-2">
              <div className="w-32">
                <Select
                  value={countryCode || "+51"}
                  onValueChange={(value) => setValue("countryCode", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+51">🇵🇪 +51</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                {...register("phone")}
                type="tel"
                placeholder="987654321"
                maxLength={9}
                disabled={isLoading}
                className="flex-1"
              />
            </div>
            <FieldDescription>
              {t.pages.profile.fields.phoneHelp}
            </FieldDescription>
            <FieldError>{errors.phone?.message}</FieldError>
          </Field>

          {/* Birthday */}
          <Field>
            <FieldLabel>{t.pages.profile.fields.birthday}</FieldLabel>
            <Input
              type="date"
              max={
                new Date(new Date().setFullYear(new Date().getFullYear() - 16))
                  .toISOString()
                  .split("T")[0]
              }
              defaultValue={
                user.birthday
                  ? new Date(user.birthday).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setValue("birthday", date || undefined);
              }}
              disabled={isLoading}
            />
            <FieldDescription>
              {t.pages.profile.fields.birthdayHelp}
            </FieldDescription>
            <FieldError>{errors.birthday?.message}</FieldError>
          </Field>

          {/* Timezone */}
          <Field>
            <FieldLabel>{t.pages.profile.fields.timezone}</FieldLabel>
            <Select
              value={timeZone || "America/Lima"}
              onValueChange={(value) => setValue("timeZone", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Lima">
                  America/Lima (GMT-5)
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldError>{errors.timeZone?.message}</FieldError>
          </Field>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.pages.profile.actions.saveChanges}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
