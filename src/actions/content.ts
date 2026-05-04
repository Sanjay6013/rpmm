"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function updateHomeContent(data: {
  stats?: string;
  highlights?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
}) {
  await prisma.homeContent.update({
    where: { id: "default" },
    data: {
      ...(data.stats !== undefined && { stats: JSON.parse(data.stats) }),
      ...(data.highlights !== undefined && { highlights: JSON.parse(data.highlights) }),
      ...(data.ctaTitle !== undefined && { ctaTitle: data.ctaTitle }),
      ...(data.ctaDescription !== undefined && { ctaDescription: data.ctaDescription }),
      ...(data.ctaButtonText !== undefined && { ctaButtonText: data.ctaButtonText }),
      ...(data.ctaButtonUrl !== undefined && { ctaButtonUrl: data.ctaButtonUrl }),
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function updateAboutContent(data: {
  history?: string;
  mission?: string;
  vision?: string;
  principalName?: string;
  principalMessage?: string;
  principalPhoto?: string;
  infrastructure?: string;
  values?: string;
}) {
  await prisma.aboutContent.update({
    where: { id: "default" },
    data: {
      ...(data.history !== undefined && { history: data.history }),
      ...(data.mission !== undefined && { mission: data.mission }),
      ...(data.vision !== undefined && { vision: data.vision }),
      ...(data.principalName !== undefined && { principalName: data.principalName }),
      ...(data.principalMessage !== undefined && { principalMessage: data.principalMessage }),
      ...(data.principalPhoto !== undefined && { principalPhoto: data.principalPhoto }),
      ...(data.infrastructure !== undefined && { infrastructure: JSON.parse(data.infrastructure) }),
      ...(data.values !== undefined && { values: JSON.parse(data.values) }),
    },
  });

  revalidatePath("/about");
  return { success: true };
}

export async function createHeroSlide(data: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  await prisma.heroSlide.create({ data });
  revalidatePath("/");
  return { success: true };
}

export async function updateHeroSlide(
  id: string,
  data: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    ctaText?: string;
    ctaUrl?: string;
    sortOrder?: number;
    isActive?: boolean;
  }
) {
  await prisma.heroSlide.update({ where: { id }, data });
  revalidatePath("/");
  return { success: true };
}

export async function deleteHeroSlide(id: string) {
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/");
  return { success: true };
}
