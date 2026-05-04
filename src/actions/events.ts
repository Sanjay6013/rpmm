"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createEvent(data: {
  title: string;
  slug: string;
  startDate: string;
  endDate?: string;
  location?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  isPublished: boolean;
}) {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        slug: data.slug,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        location: data.location || null,
        excerpt: data.excerpt || null,
        content: data.content || null,
        coverImage: data.coverImage || null,
        isPublished: data.isPublished,
      },
    });
    revalidatePath("/events");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create event. Slug may already exist." };
  }
}

export async function updateEvent(
  id: string,
  data: {
    title?: string;
    slug?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    isPublished?: boolean;
  }
) {
  await prisma.event.update({
    where: { id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : data.endDate === "" ? null : undefined,
      location: data.location || null,
      excerpt: data.excerpt || null,
      content: data.content || null,
      coverImage: data.coverImage || null,
    },
  });
  revalidatePath("/events");
  return { success: true };
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } });
  revalidatePath("/events");
  return { success: true };
}

export async function toggleEventPublish(id: string) {
  const event = await prisma.event.findUnique({ where: { id }, select: { isPublished: true } });
  if (!event) return { success: false };
  await prisma.event.update({ where: { id }, data: { isPublished: !event.isPublished } });
  revalidatePath("/events");
  return { success: true };
}
