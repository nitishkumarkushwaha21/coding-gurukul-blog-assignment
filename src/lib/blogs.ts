// Provides blog CRUD using Neon when available, with JSON fallback for local use.
import fs from "fs";
import path from "path";

import readingTime from "reading-time";
import slugify from "slugify";

import type { Blog } from "@/types/blog";
import { hasDatabase, sql } from "@/lib/db";

const BLOGS_PATH = path.join(process.cwd(), "src", "data", "blogs.json");
let memoryStore: Blog[] | null = null;

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  author_avatar: string;
  tags: string[] | null;
  featured: boolean;
  status: "draft" | "published";
  created_at: string | Date;
  updated_at: string | Date;
};

function toIsoDate(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value;
}

function toBlog(row: BlogRow): Blog {
  return withReadingTime({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    author: {
      name: row.author_name,
      avatar: row.author_avatar,
    },
    tags: row.tags ?? [],
    featured: row.featured,
    status: row.status,
    createdAt: toIsoDate(row.created_at),
    updatedAt: toIsoDate(row.updated_at),
  });
}

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

function getAllBlogsFromJson(): Blog[] {
  return loadBlogs()
    .map(withReadingTime)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

async function getAllBlogsFromDb(): Promise<Blog[]> {
  if (!hasDatabase || !sql) {
    return getAllBlogsFromJson();
  }

  try {
    const rows = await sql<BlogRow[]>`
      select
        id,
        slug,
        title,
        excerpt,
        content,
        cover_image,
        author_name,
        author_avatar,
        tags,
        featured,
        status,
        created_at,
        updated_at
      from blogs
      order by created_at desc
    `;

    return rows.map(toBlog);
  } catch {
    return getAllBlogsFromJson();
  }
}

async function getBlogBySlugFromDb(slug: string): Promise<Blog | null> {
  if (!hasDatabase || !sql) {
    return getBlogBySlugSync(slug);
  }

  try {
    const rows = await sql<BlogRow[]>`
      select
        id,
        slug,
        title,
        excerpt,
        content,
        cover_image,
        author_name,
        author_avatar,
        tags,
        featured,
        status,
        created_at,
        updated_at
      from blogs
      where slug = ${slug}
      limit 1
    `;

    return rows[0] ? toBlog(rows[0]) : null;
  } catch {
    return getBlogBySlugSync(slug);
  }
}

function getBlogBySlugSync(slug: string): Blog | null {
  const match = loadBlogs().find((blog) => blog.slug === slug);
  return match ? withReadingTime(match) : null;
}

export async function getAllBlogs(): Promise<Blog[]> {
  return getAllBlogsFromDb();
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  const blogs = await getAllBlogsFromDb();
  return blogs.filter((blog) => blog.status === "published");
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  return getBlogBySlugFromDb(slug);
}

export async function createBlog(
  data: Omit<Blog, "id" | "slug" | "createdAt" | "updatedAt"> & {
    slug?: string;
  },
): Promise<Blog> {
  if (hasDatabase && sql) {
    const existing = await getAllBlogsFromDb();
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const slug = data.slug?.trim()
      ? generateSlug(data.slug, existing)
      : generateSlug(data.title, existing);

    try {
      const rows = await sql<BlogRow[]>`
        insert into blogs (
          id,
          slug,
          title,
          excerpt,
          content,
          cover_image,
          author_name,
          author_avatar,
          tags,
          featured,
          status,
          created_at,
          updated_at
        ) values (
          ${id},
          ${slug},
          ${data.title},
          ${data.excerpt},
          ${data.content},
          ${data.coverImage},
          ${data.author.name},
          ${data.author.avatar},
          ${data.tags},
          ${data.featured},
          ${data.status},
          ${now},
          ${now}
        )
        returning
          id,
          slug,
          title,
          excerpt,
          content,
          cover_image,
          author_name,
          author_avatar,
          tags,
          featured,
          status,
          created_at,
          updated_at
      `;

      if (rows[0]) {
        return toBlog(rows[0]);
      }
    } catch {
      // fall back to local JSON below
    }
  }

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

export async function updateBlog(slug: string, data: Partial<Blog>): Promise<Blog> {
  if (hasDatabase && sql) {
    const blogs = await getAllBlogsFromDb();
    const current = blogs.find((blog) => blog.slug === slug);

    if (!current) {
      throw new Error("Blog not found");
    }

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

    const merged: Blog = {
      ...current,
      ...data,
      slug: nextSlug,
      updatedAt: new Date().toISOString(),
      author: {
        name: data.author?.name ?? current.author.name,
        avatar: data.author?.avatar ?? current.author.avatar,
      },
      tags: Array.isArray(data.tags) ? data.tags : current.tags,
    };

    try {
      const rows = await sql<BlogRow[]>`
        update blogs
        set
          slug = ${merged.slug},
          title = ${merged.title},
          excerpt = ${merged.excerpt},
          content = ${merged.content},
          cover_image = ${merged.coverImage},
          author_name = ${merged.author.name},
          author_avatar = ${merged.author.avatar},
          tags = ${merged.tags},
          featured = ${merged.featured},
          status = ${merged.status},
          updated_at = ${merged.updatedAt}
        where slug = ${slug}
        returning
          id,
          slug,
          title,
          excerpt,
          content,
          cover_image,
          author_name,
          author_avatar,
          tags,
          featured,
          status,
          created_at,
          updated_at
      `;

      if (rows[0]) {
        return toBlog(rows[0]);
      }
    } catch {
      // fall back to local JSON below
    }
  }

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

export async function deleteBlog(slug: string): Promise<void> {
  if (hasDatabase && sql) {
    try {
      await sql`delete from blogs where slug = ${slug}`;
      return;
    } catch {
      // fall back to local JSON below
    }
  }

  const blogs = loadBlogs();
  const updated = blogs.filter((blog) => blog.slug !== slug);
  saveBlogs(updated);
}

export async function togglePublish(slug: string): Promise<Blog> {
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    throw new Error("Blog not found");
  }

  return updateBlog(slug, {
    status: blog.status === "published" ? "draft" : "published",
  });
}
