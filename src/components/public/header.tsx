import Link from "next/link";
import { GraduationCap } from "lucide-react";
import prisma from "@/lib/prisma";
import { HeaderClient } from "./header-client";

export async function Header() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  return <HeaderClient schoolName={settings?.schoolName ?? "RPMM"} />;
}
