import { NextResponse } from "next/server";

import { deleteBlog, getBlogBySlug, updateBlog } from "@/lib/blogs";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ blog });
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const blog = updateBlog(params.slug, body);
    return NextResponse.json({ blog });
  } catch {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const existing = getBlogBySlug(params.slug);
  if (!existing) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  deleteBlog(params.slug);
  return NextResponse.json({ ok: true });
}
