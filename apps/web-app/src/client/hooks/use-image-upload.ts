/**
 * Image Upload Hook
 *
 * React hook for handling image uploads with processing.
 * Provides loading state, progress tracking, and error handling.
 */

import { useState, useCallback } from "react";
import type { ImagePreset } from "@/shared/constants/image.constants";
import { IMAGE_LIMITS } from "@/shared/constants/image.constants";
import {
  validateImageFile,
  formatFileSize,
  processImageWithPreset,
  getStorageService,
  calculateCompressionRatio,
} from "@/client/lib/storage";
import type { ImageUploadResult } from "@/client/lib/storage";
import { logger } from "@/shared/lib/logger";

interface UseImageUploadOptions {
  /** Storage path (without extension) */
  storagePath: string;

  /** Image preset to use */
  preset: ImagePreset;

  /** Callback when upload completes successfully */
  onSuccess?: (result: ImageUploadResult) => void;

  /** Callback when upload fails */
  onError?: (error: Error) => void;
}

type UploadStatus = "idle" | "processing" | "uploading" | "complete" | "error";

interface UseImageUploadReturn {
  /** Upload an image file */
  upload: (file: File) => Promise<ImageUploadResult | null>;

  /** Whether upload is in progress */
  isUploading: boolean;

  /** Current status */
  status: UploadStatus;

  /** Upload progress (0-100) - currently just start/end */
  progress: number;

  /** Last error message */
  error: string | null;

  /** Last successful upload result */
  result: ImageUploadResult | null;

  /** Preview URL for the selected image (before upload completes) */
  previewUrl: string | null;

  /** Reset state */
  reset: () => void;
}

/**
 * Hook for uploading images with automatic processing
 *
 * @example
 * ```tsx
 * const { upload, isUploading, error, result } = useImageUpload({
 *   storagePath: `users/${userId}/avatar`,
 *   preset: 'avatar',
 *   onSuccess: (result) => {
 *     // Update user profile with new URL
 *     updateProfile({ pictureFullPath: result.url });
 *   },
 * });
 *
 * const handleFileChange = async (e) => {
 *   const file = e.target.files[0];
 *   if (file) await upload(file);
 * };
 * ```
 */
export function useImageUpload(
  options: UseImageUploadOptions
): UseImageUploadReturn {
  const { storagePath, preset, onSuccess, onError } = options;

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImageUploadResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setError(null);
    setResult(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  }, [previewUrl]);

  const upload = useCallback(
    async (file: File): Promise<ImageUploadResult | null> => {
      // Clean up previous preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Create instant preview
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);

      setStatus("processing");
      setProgress(0);
      setError(null);
      setResult(null);

      try {
        // Validate file first
        const validation = validateImageFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        logger.info(
          "useImageUpload",
          "system",
          `Starting upload: ${file.name} (${formatFileSize(file.size)})`
        );

        setProgress(10); // Processing started

        // Process image (resize + convert)
        const processed = await processImageWithPreset(file, preset);

        setStatus("uploading");
        setProgress(50);

        // Upload to storage
        const extension =
          IMAGE_LIMITS.formatExtensions[
            processed.mimeType.split("/")[1] as "webp" | "jpeg" | "png"
          ];
        const fullPath = `${storagePath}${extension}`;

        const storageService = getStorageService();
        const uploadResultRaw = await storageService.upload(processed.blob, {
          path: fullPath,
          contentType: processed.mimeType,
          metadata: {
            originalName: file.name,
            originalSize: String(file.size),
            processedWidth: String(processed.width),
            processedHeight: String(processed.height),
            preset,
          },
        });

        const compressionRatio = calculateCompressionRatio(
          file.size,
          processed.sizeBytes
        );

        const uploadResult: ImageUploadResult = {
          url: uploadResultRaw.url,
          path: uploadResultRaw.path,
          original: {
            name: file.name,
            sizeBytes: file.size,
            type: file.type,
          },
          processed: {
            width: processed.width,
            height: processed.height,
            sizeBytes: processed.sizeBytes,
            format: processed.mimeType.split("/")[1] as "webp" | "jpeg" | "png",
          },
          compressionRatio,
        };

        setProgress(100);
        setStatus("complete");
        setResult(uploadResult);

        logger.info(
          "useImageUpload",
          "system",
          `Upload complete: ${uploadResult.url} (${uploadResult.compressionRatio}% compression)`
        );

        onSuccess?.(uploadResult);

        return uploadResult;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        setStatus("error");

        logger.error(
          "useImageUpload",
          "system",
          `Upload failed: ${errorMessage}`
        );

        onError?.(err instanceof Error ? err : new Error(errorMessage));

        return null;
      }
    },
    [storagePath, preset, onSuccess, onError, previewUrl]
  );

  const isUploading = status === "processing" || status === "uploading";

  return {
    upload,
    isUploading,
    status,
    progress,
    error,
    result,
    previewUrl,
    reset,
  };
}
