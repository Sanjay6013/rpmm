"use server";

import { revalidatePath } from "next/cache";
import { hashSync } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    return { success: false, error: "Email already exists" };
  }

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashSync(data.password, 12),
      role: data.role as "SUPER_ADMIN" | "ADMIN" | "EDITOR",
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUser(
  id: string,
  data: { name: string; email: string; role: string }
) {
  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      role: data.role as "SUPER_ADMIN" | "ADMIN" | "EDITOR",
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function changePassword(id: string, password: string) {
  await prisma.user.update({
    where: { id },
    data: { password: hashSync(password, 12) },
  });
  return { success: true };
}
