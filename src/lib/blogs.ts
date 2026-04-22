import fs from "fs";
import path from "path";

import readingTime from "reading-time";
import slugify from "slugify";

import type { Blog } from "@/types/blog";

const BLOGS_PATH = path.join(process.cwd(), "src", "data", "blogs.json");
let memoryStore: Blog[] | null = null;

function loadBlogs(): Blog[] {
  if (memoryStore) {
    return memoryStore;
  }

  try {
    const raw = fs.readFileSync(BLOGS_PATH, "utf8");
    const parsed = JSON.parse(raw) as Blog[];
    memoryStore = parsed;
    return parsed;
  } catch {
    memoryStore = [];
    return [];
  }
}

function saveBlogs(blogs: Blog[]) {
  memoryStore = blogs;

  try {
    fs.writeFileSync(BLOGS_PATH, JSON.stringify(blogs, null, 2), "utf8");
  } catch {
    // In environments with read-only file systems, keep the in-memory fallback.
  }
}

function generateSlug(title: string, existing: Blog[]): string {
  const base =
    slugify(title, { lower: true, strict: true, trim: true }) ||
    "untitled-blog";
  let slug = base;
  let index = 2;

  while (existing.some((blog) => blog.slug === slug)) {
    slug = `${base}-${index}`;
    index += 1;
  }

  return slug;
}

function withReadingTime(blog: Blog): Blog {
  return {
    ...blog,
    readingTime: readingTime(blog.content).text,
  };
}

export function getAllBlogs(): Blog[] {
  return loadBlogs()
    .map(withReadingTime)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getPublishedBlogs(): Blog[] {
  return getAllBlogs().filter((blog) => blog.status === "published");
}

export function getBlogBySlug(slug: string): Blog | null {
  const match = loadBlogs().find((blog) => blog.slug === slug);
  return match ? withReadingTime(match) : null;
}

export function createBlog(
  data: Omit<Blog, "id" | "slug" | "createdAt" | "updatedAt"> & {
    slug?: string;
  },
): Blog {
  const blogs = loadBlogs();
  const now = new Date().toISOString();

  const blog: Blog = withReadingTime({
    ...data,
    id: crypto.randomUUID(),
    slug: data.slug?.trim()
      ? generateSlug(data.slug, blogs)
      : generateSlug(data.title, blogs),
    createdAt: now,
    updatedAt: now,
  });

  const updated = [blog, ...blogs];
  saveBlogs(updated);
  return blog;
}

export function updateBlog(slug: string, data: Partial<Blog>): Blog {
  const blogs = loadBlogs();
  const index = blogs.findIndex((blog) => blog.slug === slug);

  if (index < 0) {
    throw new Error("Blog not found");
  }

  const current = blogs[index];
  const nextSlug =
    typeof data.slug === "string" && data.slug.trim()
      ? generateSlug(
          data.slug,
          blogs.filter((b) => b.slug !== slug),
        )
      : data.title && data.title !== current.title
        ? generateSlug(
            data.title,
            blogs.filter((b) => b.slug !== slug),
          )
        : current.slug;

  const updatedBlog = withReadingTime({
    ...current,
    ...data,
    slug: nextSlug,
    updatedAt: new Date().toISOString(),
  });

  blogs[index] = updatedBlog;
  saveBlogs(blogs);
  return updatedBlog;
}

export function deleteBlog(slug: string): void {
  const blogs = loadBlogs();
  const updated = blogs.filter((blog) => blog.slug !== slug);
  saveBlogs(updated);
}

export function togglePublish(slug: string): Blog {
  const blog = getBlogBySlug(slug);

  if (!blog) {
    throw new Error("Blog not found");
  }

  return updateBlog(slug, {
    status: blog.status === "published" ? "draft" : "published",
  });
}
