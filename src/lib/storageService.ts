// src/lib/storageService.ts
// Firebase Storage helpers for uploading files

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload a file to Firebase Storage with progress tracking.
 * @param file - The File object to upload
 * @param path - Storage path, e.g. "products/myimage.jpg"
 * @param onProgress - Optional callback with upload percentage (0–100)
 * @returns The public download URL
 */
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(progress));
      },
      reject,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/**
 * Upload a product image and return the download URL.
 */
export async function uploadProductImage(
  file: File,
  productId: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `products/${productId}_${Date.now()}.${ext}`;
  return uploadFile(file, path, onProgress);
}

/**
 * Upload a gallery image.
 */
export async function uploadGalleryImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `gallery/${Date.now()}_${file.name.replace(/\s/g, "_")}.${ext}`;
  return uploadFile(file, path, onProgress);
}

/**
 * Upload a certificate file.
 */
export async function uploadCertificate(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `certificates/${Date.now()}_${file.name.replace(/\s/g, "_")}.${ext}`;
  return uploadFile(file, path, onProgress);
}

/**
 * Delete a file from Storage by its full path.
 */
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

/**
 * Get the download URL for a given storage path.
 */
export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}
