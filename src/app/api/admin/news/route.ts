import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const news = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, slug: true, author: true, publishedAt: true, isPublished: true },
  });
  return NextResponse.json({ news });
}
