"use client";

import { useMemo, useState } from "react";
import type React from "react";

type CodeBlockProps = {
  children?: React.ReactNode;
  className?: string;
};

function flattenText(node: React.ReactNode): string {
  if (typeof node === "string") {
    return node;
  }

  if (typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(flattenText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const childNode = node as { props?: { children?: React.ReactNode } };
    return flattenText(childNode.props?.children ?? "");
  }

  return "";
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => flattenText(children).trimEnd(), [children]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-200"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className={className}>{children}</pre>
    </div>
  );
}
