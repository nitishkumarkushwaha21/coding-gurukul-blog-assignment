import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import type React from "react";

import { CodeBlock } from "@/components/CodeBlock";
import { MDXImage } from "@/components/MDXImage";
import { MDXLink } from "@/components/MDXLink";

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      {...props}
      className="font-display text-4xl leading-tight tracking-tight text-slate-900 md:text-5xl"
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className="mt-10 border-b border-slate-200 pb-3 font-display text-3xl leading-tight text-slate-900"
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className="mt-8 font-display text-2xl leading-tight text-slate-900"
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      {...props}
      className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800"
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock
      {...props}
      className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100"
    />
  ),
  img: MDXImage,
  a: MDXLink,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className="my-6 border-l-4 border-amber-400 pl-4 italic text-slate-600"
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="my-4 list-disc space-y-2 pl-6" />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="my-4 list-decimal space-y-2 pl-6" />
  ),
};

export function renderMDX(content: string) {
  return (
    <MDXRemote
      source={content}
      components={mdxComponents}
      options={{
        mdxOptions: {
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "append" }],
            rehypeHighlight,
          ],
        },
      }}
    />
  );
}
