import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const [homeContent, heroSlides] = await Promise.all([
    prisma.homeContent.findUnique({ where: { id: "default" } }),
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return NextResponse.json({ homeContent, heroSlides });
}
