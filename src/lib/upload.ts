import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveFile(
  file: File,
  category: string = "general"
): Promise<{ url: string; filename: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(UPLOAD_DIR, category);

  await mkdir(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  await writeFile(filepath, buffer);

  return {
    url: `/uploads/${category}/${filename}`,
    filename,
  };
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const filepath = path.join(process.cwd(), "public", url);
    await unlink(filepath);
  } catch {
    // File might not exist, ignore
  }
}
