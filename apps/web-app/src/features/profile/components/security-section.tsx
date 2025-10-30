"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

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

import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/user.schema";
import { changePassword } from "@/actions/user/change-password.action";
import { logger } from "@/lib/logger";

export function SecuritySection() {
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
        toast.success("Password changed successfully");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <Field>
            <FieldLabel>
              Current Password <span className="text-destructive">*</span>
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
              New Password <span className="text-destructive">*</span>
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
            <FieldDescription>Must be at least 8 characters</FieldDescription>
            <FieldError>{errors.newPassword?.message}</FieldError>
          </Field>

          {/* Confirm Password */}
          <Field>
            <FieldLabel>
              Confirm New Password <span className="text-destructive">*</span>
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
            Change Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
