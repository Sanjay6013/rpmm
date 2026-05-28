import { NextRequest, NextResponse } from "next/server";
import { fetchPrivateBlob } from "@/lib/blob-url";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.includes("blob.vercel-storage.com")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const { data, contentType, cacheControl } = await fetchPrivateBlob(url);

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": cacheControl,
      },
    });
  } catch {
    return NextResponse.json({ error: "Blob not found" }, { status: 404 });
  }
}
