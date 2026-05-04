import { NextRequest, NextResponse } from "next/server";
import { handleImageUpload } from "@/actions/upload";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const category = (formData.get("category") as string) ?? "general";
    const result = await handleImageUpload(formData, category);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ url: result.url });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
