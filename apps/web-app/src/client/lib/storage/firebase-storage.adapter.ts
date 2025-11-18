/**
 * Firebase Storage Adapter
 *
 * Implementation of IStorageService for Firebase Cloud Storage.
 * Handles uploading, deleting, and retrieving URLs.
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadMetadata,
} from "firebase/storage";
import { getFirebaseStorage } from "@/client/lib/auth/firebase/config";
import type {
  IStorageService,
  StorageUploadOptions,
  StorageUploadResult,
} from "./types";

/**
 * Firebase Storage implementation
 */
export class FirebaseStorageAdapter implements IStorageService {
  /**
   * Upload a blob to Firebase Storage
   */
  async upload(
    blob: Blob,
    options: StorageUploadOptions
  ): Promise<StorageUploadResult> {
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, options.path);

    // Build metadata
    const metadata: UploadMetadata = {
      contentType: options.contentType,
      cacheControl: options.cacheControl ?? "public, max-age=31536000", // 1 year cache
      customMetadata: options.metadata,
    };

    // Upload
    const snapshot = await uploadBytes(storageRef, blob, metadata);

    // Get download URL
    const url = await getDownloadURL(snapshot.ref);

    return {
      url,
      path: options.path,
      sizeBytes: snapshot.metadata.size,
      uploadedAt: new Date(snapshot.metadata.timeCreated),
    };
  }

  /**
   * Delete a file from Firebase Storage
   */
  async delete(path: string): Promise<void> {
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }

  /**
   * Get public URL for a storage path
   */
  async getUrl(path: string): Promise<string> {
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }
}

/**
 * Singleton instance
 */
let storageServiceInstance: FirebaseStorageAdapter | null = null;

/**
 * Get Firebase Storage service instance
 */
export function getStorageService(): IStorageService {
  if (!storageServiceInstance) {
    storageServiceInstance = new FirebaseStorageAdapter();
  }
  return storageServiceInstance;
}
