import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    select: { id: true, title: true, slug: true, startDate: true, location: true, isPublished: true },
  });
  return NextResponse.json({ events });
}
