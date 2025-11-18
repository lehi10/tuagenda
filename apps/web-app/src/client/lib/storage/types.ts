/**
 * Storage and Image Processing Types
 *
 * Core types for the image processing and storage system.
 * Designed for modularity and future extensibility.
 */

import type {
  ImageFormat,
  ImagePreset,
} from "@/shared/constants/image.constants";

/**
 * Options for image processing
 */
export interface ImageProcessingOptions {
  /** Output format (webp, jpeg, png) */
  format: ImageFormat;

  /** Maximum width in pixels */
  maxWidth: number;

  /** Maximum height in pixels */
  maxHeight: number;

  /** Quality 0-1 (only for lossy formats) */
  quality: number;
}

/**
 * Result of image processing
 */
export interface ProcessedImage {
  /** Processed image blob */
  blob: Blob;

  /** Final width after processing */
  width: number;

  /** Final height after processing */
  height: number;

  /** File size in bytes */
  sizeBytes: number;

  /** MIME type of output */
  mimeType: string;

  /** Suggested filename with extension */
  filename: string;
}

/**
 * Image validation result
 */
export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Storage upload options
 */
export interface StorageUploadOptions {
  /** Storage path (without extension) */
  path: string;

  /** Content type/MIME type */
  contentType: string;

  /** Custom metadata */
  metadata?: Record<string, string>;

  /** Cache control header */
  cacheControl?: string;
}

/**
 * Storage upload result
 */
export interface StorageUploadResult {
  /** Public URL of uploaded file */
  url: string;

  /** Full storage path */
  path: string;

  /** File size in bytes */
  sizeBytes: number;

  /** Upload timestamp */
  uploadedAt: Date;
}

/**
 * Storage service interface (Port)
 * Implementations can be Firebase, S3, etc.
 */
export interface IStorageService {
  /**
   * Upload a blob to storage
   */
  upload(
    blob: Blob,
    options: StorageUploadOptions
  ): Promise<StorageUploadResult>;

  /**
   * Delete a file from storage
   */
  delete(path: string): Promise<void>;

  /**
   * Get public URL for a path
   */
  getUrl(path: string): Promise<string>;
}

/**
 * Image processor interface (Port)
 * Implementations can be Canvas, OffscreenCanvas, etc.
 */
export interface IImageProcessor {
  /**
   * Process an image file
   */
  process(file: File, options: ImageProcessingOptions): Promise<ProcessedImage>;

  /**
   * Validate an image file before processing
   */
  validate(file: File): ImageValidationResult;
}

/**
 * Preset-based processing options
 */
export interface PresetProcessingOptions {
  /** Preset name (avatar, thumbnail, etc.) */
  preset: ImagePreset;

  /** Override format (optional) */
  format?: ImageFormat;

  /** Override quality (optional) */
  quality?: number;
}

/**
 * Complete image upload options
 */
export interface ImageUploadOptions {
  /** File to upload */
  file: File;

  /** Storage path (without extension) */
  storagePath: string;

  /** Processing preset */
  preset: ImagePreset;

  /** Override format (optional) */
  format?: ImageFormat;

  /** Custom metadata (optional) */
  metadata?: Record<string, string>;
}

/**
 * Complete image upload result
 */
export interface ImageUploadResult {
  /** Public URL */
  url: string;

  /** Storage path */
  path: string;

  /** Original file info */
  original: {
    name: string;
    sizeBytes: number;
    type: string;
  };

  /** Processed file info */
  processed: {
    width: number;
    height: number;
    sizeBytes: number;
    format: ImageFormat;
  };

  /** Compression ratio */
  compressionRatio: number;
}
