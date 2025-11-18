/**
 * Storage Module
 *
 * Client-side image processing and cloud storage integration.
 * Processes images in browser (zero server cost) and uploads to Firebase Storage.
 */

// Core types
export type {
  ImageProcessingOptions,
  ProcessedImage,
  ImageValidationResult,
  StorageUploadOptions,
  StorageUploadResult,
  IStorageService,
  IImageProcessor,
  ImageUploadOptions,
  ImageUploadResult,
} from "./types";

// Image processor
export {
  CanvasImageProcessor,
  processImageWithPreset,
  validateImageFile,
  formatFileSize,
  calculateCompressionRatio,
} from "./image-processor";

// Storage service
export {
  FirebaseStorageAdapter,
  getStorageService,
} from "./firebase-storage.adapter";

// High-level upload functions
export {
  uploadImage,
  uploadUserAvatar,
  uploadBusinessLogo,
  uploadBusinessCover,
  uploadServicePhoto,
  deleteImage,
} from "./image-upload.service";
