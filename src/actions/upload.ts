"use server";

import { saveFile, deleteFile } from "@/lib/upload";

export async function handleImageUpload(formData: FormData, category: string = "general") {
  const file = formData.get("file") as File;
  if (!file) return { success: false, error: "No file provided" };

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Invalid file type. Only JPG, PNG, and WebP are allowed." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "File too large. Maximum size is 5MB." };
  }

  const result = await saveFile(file, category);
  return { success: true, url: result.url };
}

export async function deleteImage(url: string) {
  await deleteFile(url);
  return { success: true };
}
