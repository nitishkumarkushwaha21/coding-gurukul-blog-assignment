import { NextResponse } from "next/server";

import { togglePublish } from "@/lib/blogs";

export async function PATCH(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const blog = togglePublish(params.slug);
    return NextResponse.json({ blog });
  } catch {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }
}
