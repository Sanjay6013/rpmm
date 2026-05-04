"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function updateSettings(data: {
  schoolName?: string;
  schoolFullName?: string;
  tagline?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  officeHours?: string;
  logoUrl?: string;
  faviconUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  mapEmbedUrl?: string;
}) {
  await prisma.siteSettings.update({
    where: { id: "default" },
    data,
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  return { success: true };
}
