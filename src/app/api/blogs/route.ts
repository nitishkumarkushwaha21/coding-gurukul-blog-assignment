// Exposes list and create APIs for blog resources.
import { NextResponse } from "next/server";

import { createBlog, getAllBlogs } from "@/lib/blogs";

export async function GET() {
  const blogs = await getAllBlogs();
  return NextResponse.json({ blogs });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.title !== "string" ||
    typeof body.excerpt !== "string" ||
    typeof body.content !== "string" ||
    !body.author ||
    typeof body.author.name !== "string" ||
    typeof body.author.avatar !== "string"
  ) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const blog = await createBlog({
    title: body.title,
    slug: typeof body.slug === "string" ? body.slug : undefined,
    excerpt: body.excerpt,
    content: body.content,
    coverImage: body.coverImage || "https://picsum.photos/800/400?random=50",
    author: body.author,
    tags: Array.isArray(body.tags) ? body.tags : [],
    featured: Boolean(body.featured),
    status: body.status === "published" ? "published" : "draft",
  });

  return NextResponse.json({ blog }, { status: 201 });
}
