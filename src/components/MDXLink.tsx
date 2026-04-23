import { ExternalLink } from "lucide-react";
import type React from "react";

interface MDXLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export function MDXLink({ href = "", children, ...props }: MDXLinkProps) {
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 underline decoration-slate-400 underline-offset-2 hover:text-slate-900"
        {...props}
      >
        <span>{children}</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <a
      href={href}
      className="underline decoration-slate-400 underline-offset-2 hover:text-slate-900"
      {...props}
    >
      {children}
    </a>
  );
}
