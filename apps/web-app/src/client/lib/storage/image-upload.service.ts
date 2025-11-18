/**
 * Image Upload Service
 *
 * High-level service that combines image processing and storage upload.
 * This is the main entry point for uploading images in the application.
 */

import { IMAGE_LIMITS } from "@/shared/constants/image.constants";
import type { ImageFormat } from "@/shared/constants/image.constants";
import {
  processImageWithPreset,
  calculateCompressionRatio,
} from "./image-processor";
import { getStorageService } from "./firebase-storage.adapter";
import type { ImageUploadOptions, ImageUploadResult } from "./types";

/**
 * Upload an image with automatic processing
 *
 * @param options Upload configuration
 * @returns Upload result with URLs and metadata
 *
 * @example
 * ```typescript
 * const result = await uploadImage({
 *   file: fileInput.files[0],
 *   storagePath: STORAGE_PATHS.userAvatar(userId),
 *   preset: 'avatar',
 * });
 * console.log(result.url); // Firebase Storage URL
 * ```
 */
export async function uploadImage(
  options: ImageUploadOptions
): Promise<ImageUploadResult> {
  const { file, storagePath, preset, format, metadata } = options;

  // 1. Process image (resize + convert format)
  const processed = await processImageWithPreset(file, preset, format);

  // 2. Build full storage path with extension
  const extension =
    IMAGE_LIMITS.formatExtensions[
      processed.mimeType.split("/")[1] as ImageFormat
    ];
  const fullPath = `${storagePath}${extension}`;

  // 3. Upload to storage
  const storageService = getStorageService();
  const uploadResult = await storageService.upload(processed.blob, {
    path: fullPath,
    contentType: processed.mimeType,
    metadata: {
      ...metadata,
      originalName: file.name,
      originalSize: String(file.size),
      processedWidth: String(processed.width),
      processedHeight: String(processed.height),
      preset,
    },
  });

  // 4. Calculate compression stats
  const compressionRatio = calculateCompressionRatio(
    file.size,
    processed.sizeBytes
  );

  return {
    url: uploadResult.url,
    path: uploadResult.path,
    original: {
      name: file.name,
      sizeBytes: file.size,
      type: file.type,
    },
    processed: {
      width: processed.width,
      height: processed.height,
      sizeBytes: processed.sizeBytes,
      format: processed.mimeType.split("/")[1] as ImageFormat,
    },
    compressionRatio,
  };
}

/**
 * Upload user avatar
 */
export async function uploadUserAvatar(
  file: File,
  userId: string
): Promise<ImageUploadResult> {
  return uploadImage({
    file,
    storagePath: `users/${userId}/avatar`,
    preset: "avatar",
  });
}

/**
 * Upload business logo
 */
export async function uploadBusinessLogo(
  file: File,
  businessId: string
): Promise<ImageUploadResult> {
  return uploadImage({
    file,
    storagePath: `businesses/${businessId}/logo`,
    preset: "logo",
  });
}

/**
 * Upload business cover image
 */
export async function uploadBusinessCover(
  file: File,
  businessId: string
): Promise<ImageUploadResult> {
  return uploadImage({
    file,
    storagePath: `businesses/${businessId}/cover`,
    preset: "cover",
  });
}

/**
 * Upload service photo
 */
export async function uploadServicePhoto(
  file: File,
  serviceId: string
): Promise<ImageUploadResult> {
  const photoId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
  return uploadImage({
    file,
    storagePath: `services/${serviceId}/photos/${photoId}`,
    preset: "service",
  });
}

/**
 * Delete an image from storage
 */
export async function deleteImage(path: string): Promise<void> {
  const storageService = getStorageService();
  await storageService.delete(path);
}
