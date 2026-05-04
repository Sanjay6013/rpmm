"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function updateInquiryStatus(id: string, status: string, notes?: string) {
  await prisma.contactInquiry.update({
    where: { id },
    data: {
      status: status as "NEW" | "READ" | "REPLIED" | "ARCHIVED",
      ...(notes !== undefined && { notes }),
    },
  });
  revalidatePath("/admin/inquiries");
  return { success: true };
}

export async function deleteInquiry(id: string) {
  await prisma.contactInquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
  return { success: true };
}
