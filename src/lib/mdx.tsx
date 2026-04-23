// Renders MDX content with custom components for media, links, code, and diagrams.
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import type React from "react";

import { CodeBlock } from "@/components/CodeBlock";
import { EmbedCard } from "@/components/EmbedCard";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { MDXImage } from "@/components/MDXImage";
import { MDXLink } from "@/components/MDXLink";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

function getPreBlockInfo(children: React.ReactNode): {
  language: string;
  value: string;
} {
  if (!children || typeof children !== "object" || !("props" in children)) {
    return { language: "", value: "" };
  }

  const childNode = children as {
    props?: {
      className?: string;
      children?: string | string[];
    };
  };

  const className = childNode.props?.className ?? "";
  const language = className.replace("language-", "").trim().toLowerCase();
  const childValue = childNode.props?.children;
  const value = Array.isArray(childValue)
    ? childValue.join("")
    : String(childValue ?? "");

  return { language, value: value.trim() };
}

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
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
    const { language, value } = getPreBlockInfo(props.children);

    if (language === "mermaid" && value) {
      return <MermaidDiagram chart={value} />;
    }

    return (
      <CodeBlock
        {...props}
        className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100"
      />
    );
  },
  img: MDXImage,
  a: MDXLink,
  YouTube: YouTubeEmbed,
  EmbedCard,
  Mermaid: MermaidDiagram,
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
