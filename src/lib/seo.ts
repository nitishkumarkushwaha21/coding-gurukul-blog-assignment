import type { Metadata } from "next";
import type { Blog } from "@/types/blog";

export function buildMetadata(blog: Blog, canonical?: string): Metadata {
  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: canonical
      ? {
          canonical,
        }
      : undefined,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      images: [blog.coverImage],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImage],
    },
  };
}

export function buildPageMetadata({
  title,
  description,
  image,
  canonical,
}: {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: canonical
      ? {
          canonical,
        }
      : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
