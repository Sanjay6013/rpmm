"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createAlbum(data: {
  title: string;
  slug: string;
  description?: string;
  category: string;
  isPublished: boolean;
}) {
  try {
    await prisma.galleryAlbum.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        category: data.category as "EVENTS" | "CAMPUS" | "SPORTS" | "ACADEMICS" | "CULTURAL" | "GENERAL",
        isPublished: data.isPublished,
      },
    });
    revalidatePath("/gallery");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create album. Slug may already exist." };
  }
}

export async function updateAlbum(
  id: string,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    isPublished?: boolean;
  }
) {
  try {
    await prisma.galleryAlbum.update({
      where: { id },
      data: {
        ...data,
        description: data.description || null,
        category: data.category as "EVENTS" | "CAMPUS" | "SPORTS" | "ACADEMICS" | "CULTURAL" | "GENERAL" | undefined,
      },
    });
    revalidatePath("/gallery");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update album." };
  }
}

export async function deleteAlbum(id: string) {
  await prisma.galleryAlbum.delete({ where: { id } });
  revalidatePath("/gallery");
  return { success: true };
}

export async function uploadAlbumImages(albumId: string, urls: string[]) {
  const album = await prisma.galleryAlbum.findUnique({
    where: { id: albumId },
    include: { images: { select: { sortOrder: true }, orderBy: { sortOrder: "desc" }, take: 1 } },
  });

  const startOrder = (album?.images[0]?.sortOrder ?? -1) + 1;

  await prisma.galleryImage.createMany({
    data: urls.map((url, i) => ({
      url,
      albumId,
      sortOrder: startOrder + i,
    })),
  });

  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteImage(id: string) {
  const image = await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${image.albumId}`);
  return { success: true };
}

export async function updateImageCaption(id: string, caption: string) {
  await prisma.galleryImage.update({ where: { id }, data: { caption } });
  return { success: true };
}
