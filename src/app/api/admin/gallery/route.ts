import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const albums = await prisma.galleryAlbum.findMany({
    include: { _count: { select: { images: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ albums });
}
