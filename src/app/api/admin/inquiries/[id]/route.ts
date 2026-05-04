import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const inquiry = await prisma.contactInquiry.findUnique({ where: { id } });
  return NextResponse.json({ inquiry });
}
