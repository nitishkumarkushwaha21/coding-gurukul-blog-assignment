import { notFound } from "next/navigation";

import { BlogDetail } from "@/components/BlogDetail";
import { buildMetadata, buildPageMetadata } from "@/lib/seo";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/blogs";

export async function generateStaticParams() {
  return getPublishedBlogs().map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    return buildPageMetadata({
      title: "Blog not found",
      description: "This post does not exist.",
      canonical: `${site}/blog/${params.slug}`,
    });
  }

  return buildMetadata(blog, `${site}/blog/${blog.slug}`);
}

export default function BlogSlugPage({ params }: { params: { slug: string } }) {
  const blog = getBlogBySlug(params.slug);

  if (!blog || blog.status !== "published") {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    image: blog.coverImage,
    author: {
      "@type": "Person",
      name: blog.author.name,
    },
    datePublished: blog.createdAt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetail blog={blog} />
    </>
  );
}
