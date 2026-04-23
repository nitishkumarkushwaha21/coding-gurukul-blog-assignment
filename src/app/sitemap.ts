// Builds dynamic sitemap entries from currently published blogs.
import type { MetadataRoute } from "next";

import { getPublishedBlogs } from "@/lib/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const published = await getPublishedBlogs();

  const blogEntries: MetadataRoute.Sitemap = published.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    ...blogEntries,
  ];
}
