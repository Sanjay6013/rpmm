"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createAnnouncement(data: {
  title: string;
  content: string;
  type: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
}) {
  await prisma.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      type: data.type as "INFO" | "WARNING" | "URGENT" | "ADMISSION",
      isActive: data.isActive,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateAnnouncement(
  id: string,
  data: {
    title?: string;
    content?: string;
    type?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  }
) {
  await prisma.announcement.update({
    where: { id },
    data: {
      ...data,
      type: data.type as "INFO" | "WARNING" | "URGENT" | "ADMISSION" | undefined,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : data.endDate === "" ? null : undefined,
    },
  });
  revalidatePath("/");
  return { success: true };
}

export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/");
  return { success: true };
}

export async function toggleAnnouncementActive(id: string) {
  const ann = await prisma.announcement.findUnique({ where: { id }, select: { isActive: true } });
  if (!ann) return { success: false };
  await prisma.announcement.update({ where: { id }, data: { isActive: !ann.isActive } });
  revalidatePath("/");
  return { success: true };
}
