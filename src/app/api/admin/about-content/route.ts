import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const aboutContent = await prisma.aboutContent.findUnique({
    where: { id: "default" },
  });

  return NextResponse.json({ aboutContent });
}
