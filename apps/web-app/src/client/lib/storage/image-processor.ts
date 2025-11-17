/**
 * Client-Side Image Processor
 *
 * Uses Canvas API to resize and convert images in the browser.
 * Zero server cost - all processing happens on client device.
 */

import {
  IMAGE_LIMITS,
  IMAGE_PRESETS,
  type ImageFormat,
  type ImagePreset,
} from "@/shared/constants/image.constants";
import type {
  IImageProcessor,
  ImageProcessingOptions,
  ProcessedImage,
  ImageValidationResult,
} from "./types";

/**
 * Canvas-based image processor implementation
 */
export class CanvasImageProcessor implements IImageProcessor {
  /**
   * Validate image file before processing
   */
  validate(file: File): ImageValidationResult {
    // Check file type
    if (
      !IMAGE_LIMITS.allowedMimeTypes.includes(
        file.type as (typeof IMAGE_LIMITS.allowedMimeTypes)[number]
      )
    ) {
      return {
        valid: false,
        error: `Invalid file type: ${file.type}. Allowed: ${IMAGE_LIMITS.allowedMimeTypes.join(", ")}`,
      };
    }

    // Check file size
    if (file.size > IMAGE_LIMITS.maxInputSizeBytes) {
      const maxMB = IMAGE_LIMITS.maxInputSizeBytes / (1024 * 1024);
      const fileMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File too large: ${fileMB}MB. Maximum: ${maxMB}MB`,
      };
    }

    return { valid: true };
  }

  /**
   * Process image: resize and convert format
   */
  async process(
    file: File,
    options: ImageProcessingOptions
  ): Promise<ProcessedImage> {
    // Load image
    const img = await this.loadImage(file);

    // Calculate new dimensions maintaining aspect ratio
    const { width, height } = this.calculateDimensions(
      img.width,
      img.height,
      options.maxWidth,
      options.maxHeight
    );

    // Create canvas and draw resized image
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // Use high quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw image
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to blob in desired format
    const mimeType = IMAGE_LIMITS.formatMimeTypes[options.format];
    const blob = await this.canvasToBlob(canvas, mimeType, options.quality);

    // Generate filename
    const extension = IMAGE_LIMITS.formatExtensions[options.format];
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const filename = `${baseName}${extension}`;

    return {
      blob,
      width,
      height,
      sizeBytes: blob.size,
      mimeType,
      filename,
    };
  }

  /**
   * Load image from File into HTMLImageElement
   */
  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };

      img.src = url;
    });
  }

  /**
   * Calculate new dimensions maintaining aspect ratio
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let width = originalWidth;
    let height = originalHeight;

    // Scale down if exceeds max dimensions
    if (width > maxWidth || height > maxHeight) {
      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;
      const ratio = Math.min(widthRatio, heightRatio);

      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    // Ensure minimum dimensions
    width = Math.max(width, IMAGE_LIMITS.minDimension);
    height = Math.max(height, IMAGE_LIMITS.minDimension);

    return { width, height };
  }

  /**
   * Convert canvas to blob with specified format and quality
   */
  private canvasToBlob(
    canvas: HTMLCanvasElement,
    mimeType: string,
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        },
        mimeType,
        quality
      );
    });
  }
}

/**
 * Process image with preset configuration
 */
export async function processImageWithPreset(
  file: File,
  preset: ImagePreset,
  formatOverride?: ImageFormat
): Promise<ProcessedImage> {
  const processor = new CanvasImageProcessor();

  // Validate first
  const validation = processor.validate(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Get preset config
  const presetConfig = IMAGE_PRESETS[preset];
  const format = formatOverride ?? presetConfig.defaultFormat;

  // Process
  return processor.process(file, {
    format,
    maxWidth: presetConfig.maxWidth,
    maxHeight: presetConfig.maxHeight,
    quality: presetConfig.quality,
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): ImageValidationResult {
  const processor = new CanvasImageProcessor();
  return processor.validate(file);
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Calculate compression ratio
 */
export function calculateCompressionRatio(
  originalSize: number,
  processedSize: number
): number {
  if (originalSize === 0) return 0;
  return Math.round((1 - processedSize / originalSize) * 100);
}
