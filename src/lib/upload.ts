import { put, del } from "@vercel/blob";
import { randomUUID } from "crypto";

export async function saveFile(
  file: File,
  category: string = "general"
): Promise<{ url: string; filename: string }> {
  const ext = file.name.includes(".") ? "." + file.name.split(".").pop() : ".jpg";
  const filename = `${category}/${randomUUID()}${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    filename,
  };
}

export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // Blob might not exist, ignore
  }
}
