import type { Metadata } from "next";

import { BlogListingClient } from "@/components/BlogListingClient";
import { getPublishedBlogs } from "@/lib/blogs";

export async function generateMetadata(): Promise<Metadata> {
  const blogs = getPublishedBlogs();
  const cover =
    blogs.find((blog) => blog.featured)?.coverImage ?? blogs[0]?.coverImage;

  return {
    title: "Blog CMS | Editorial Posts",
    description:
      "An editorial-style blog listing page with curated posts, search, and pagination.",
    openGraph: {
      title: "Blog CMS | Editorial Posts",
      description:
        "An editorial-style blog listing page with curated posts, search, and pagination.",
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { q?: string; tag?: string; page?: string };
}) {
  const blogs = getPublishedBlogs();

  return <BlogListingClient blogs={blogs} searchParams={searchParams} />;
}
