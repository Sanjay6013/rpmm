"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createNews(data: {
  title: string;
  slug: string;
  author?: string;
  publishedAt: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  isPublished: boolean;
}) {
  try {
    await prisma.news.create({
      data: {
        title: data.title,
        slug: data.slug,
        author: data.author || null,
        publishedAt: new Date(data.publishedAt),
        excerpt: data.excerpt || null,
        content: data.content || null,
        coverImage: data.coverImage || null,
        isPublished: data.isPublished,
      },
    });
    revalidatePath("/news");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create news. Slug may already exist." };
  }
}

export async function updateNews(
  id: string,
  data: {
    title?: string;
    slug?: string;
    author?: string;
    publishedAt?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    isPublished?: boolean;
  }
) {
  await prisma.news.update({
    where: { id },
    data: {
      ...data,
      author: data.author || null,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      excerpt: data.excerpt || null,
      content: data.content || null,
      coverImage: data.coverImage || null,
    },
  });
  revalidatePath("/news");
  return { success: true };
}

export async function deleteNews(id: string) {
  await prisma.news.delete({ where: { id } });
  revalidatePath("/news");
  return { success: true };
}

export async function toggleNewsPublish(id: string) {
  const news = await prisma.news.findUnique({ where: { id }, select: { isPublished: true } });
  if (!news) return { success: false };
  await prisma.news.update({ where: { id }, data: { isPublished: !news.isPublished } });
  revalidatePath("/news");
  return { success: true };
}
