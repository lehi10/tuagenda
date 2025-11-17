"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { Button } from "@/client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { useTranslation } from "@/client/i18n";
import { useImageUpload } from "@/client/hooks/use-image-upload";
import { trpc } from "@/client/lib/trpc";
import { formatFileSize } from "@/client/lib/storage";
import type { UserProps } from "@/server/core/domain/entities/User";
import { logger } from "@/shared/lib/logger";

interface ProfilePhotoSectionProps {
  user: UserProps;
  onUpdate?: () => void;
}

export function ProfilePhotoSection({
  user,
  onUpdate,
}: ProfilePhotoSectionProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image upload hook
  const { upload, isUploading, status, error, previewUrl } = useImageUpload({
    storagePath: `users/${user.id}/avatar`,
    preset: "avatar",
    onSuccess: async (result) => {
      logger.info(
        "ProfilePhotoSection",
        user.id,
        `Avatar uploaded: ${result.compressionRatio}% compression`
      );

      // Update user profile with new URL
      try {
        await trpc.user.updateProfile.mutate({
          userId: user.id,
          pictureFullPath: result.url,
        });

        toast.success("Foto de perfil actualizada");
        onUpdate?.();
      } catch (err) {
        logger.error(
          "ProfilePhotoSection",
          user.id,
          `Failed to update profile: ${err}`
        );
        toast.error("Error al actualizar el perfil");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Error al subir la imagen");
    },
  });

  // Get initials from first and last name
  const getInitials = () => {
    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Handle file selection
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    logger.info(
      "ProfilePhotoSection",
      user.id,
      `Selected file: ${file.name} (${formatFileSize(file.size)})`
    );

    await upload(file);

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Get status message
  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Procesando imagen...";
      case "uploading":
        return "Subiendo...";
      default:
        return "Cambiar foto";
    }
  };

  // Determine which image to show
  const displayImageSrc =
    isUploading && previewUrl ? previewUrl : user.pictureFullPath || undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.pages.profile.sections.photo}</CardTitle>
        <CardDescription>
          {t.pages.profile.sections.photoDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {/* Avatar with upload overlay */}
        <div className="relative group">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={displayImageSrc}
              alt={`${user.firstName} ${user.lastName}`}
              className={
                isUploading
                  ? "blur-sm opacity-70 transition-all"
                  : "transition-all"
              }
            />
            <AvatarFallback className="text-2xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* Upload overlay */}
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed disabled:opacity-100"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Status message */}
        {isUploading && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {getStatusMessage()}
          </p>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {/* Upload button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {getStatusMessage()}
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Cambiar foto
            </>
          )}
        </Button>

        {/* Error message */}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Info text */}
        <p className="text-xs text-muted-foreground text-center">
          Formatos: JPG, PNG, WebP, GIF
          <br />
          Tamaño máximo: 10MB
        </p>
      </CardContent>
    </Card>
  );
}
