/**
 * Image Processing Constants
 *
 * Centralized configuration for image processing and storage.
 * Modify these values to customize behavior across the application.
 */

export const IMAGE_FORMATS = ["webp", "jpeg", "png"] as const;
export type ImageFormat = (typeof IMAGE_FORMATS)[number];

export const IMAGE_PRESETS = {
  avatar: {
    maxWidth: 256,
    maxHeight: 256,
    quality: 0.8,
    defaultFormat: "webp" as ImageFormat,
  },
  thumbnail: {
    maxWidth: 400,
    maxHeight: 300,
    quality: 0.75,
    defaultFormat: "webp" as ImageFormat,
  },
  cover: {
    maxWidth: 1200,
    maxHeight: 630,
    quality: 0.85,
    defaultFormat: "webp" as ImageFormat,
  },
  logo: {
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.85,
    defaultFormat: "webp" as ImageFormat,
  },
  service: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.8,
    defaultFormat: "webp" as ImageFormat,
  },
  original: {
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 0.9,
    defaultFormat: "webp" as ImageFormat,
  },
} as const;

export type ImagePreset = keyof typeof IMAGE_PRESETS;

export const IMAGE_LIMITS = {
  /** Maximum file size for input (before processing) */
  maxInputSizeBytes: 10 * 1024 * 1024, // 10MB

  /** Maximum dimension (width or height) for any image */
  maxDimension: 4096,

  /** Minimum dimension to avoid tiny images */
  minDimension: 16,

  /** Allowed MIME types for input */
  allowedMimeTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
  ] as const,

  /** File extensions mapping */
  formatExtensions: {
    webp: ".webp",
    jpeg: ".jpg",
    png: ".png",
  } as const,

  /** MIME types for output */
  formatMimeTypes: {
    webp: "image/webp",
    jpeg: "image/jpeg",
    png: "image/png",
  } as const,
} as const;

export const STORAGE_PATHS = {
  /** User avatar images */
  userAvatar: (userId: string) => `users/${userId}/avatar`,

  /** Business logo */
  businessLogo: (businessId: string) => `businesses/${businessId}/logo`,

  /** Business cover image */
  businessCover: (businessId: string) => `businesses/${businessId}/cover`,

  /** Service photos */
  servicePhoto: (serviceId: string, photoId: string) =>
    `services/${serviceId}/photos/${photoId}`,

  /** Generic upload with timestamp */
  generic: (folder: string, filename: string) =>
    `uploads/${folder}/${Date.now()}_${filename}`,
} as const;
