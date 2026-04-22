import { notFound } from "next/navigation";

import { AdminEditor } from "@/components/AdminEditor";
import { getBlogBySlug } from "@/lib/blogs";

export default function AdminEditPage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <section className="space-y-4" aria-label="Edit blog page">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        Edit blog
      </h1>
      <AdminEditor mode="edit" initialBlog={blog} />
    </section>
  );
}
