"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function slugFromHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function getHeadings(content: string) {
  const regex = /^(##|###)\s+(.+)$/gm;
  const headings: Array<{ level: 2 | 3; text: string; id: string }> = [];

  let match = regex.exec(content);
  while (match) {
    const level = match[1] === "###" ? 3 : 2;
    const text = match[2].trim();
    headings.push({ level, text, id: slugFromHeading(text) });
    match = regex.exec(content);
  }

  return headings;
}

export function TableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => getHeadings(content), [content]);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const targets = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean) as HTMLElement[];

    if (targets.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      <aside
        className="hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-700/70 lg:block"
        aria-label="Table of contents"
      >
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Table of contents
        </h3>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li key={heading.id} className={heading.level === 3 ? "ml-4" : ""}>
              <Link
                href={`#${heading.id}`}
                className={
                  activeId === heading.id
                    ? "font-semibold text-slate-900 dark:text-slate-100"
                    : "rounded-sm text-slate-700 hover:text-slate-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:text-slate-300 dark:hover:text-slate-100 dark:focus-visible:ring-blue-500"
                }
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="fixed bottom-5 right-5 z-40 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:ring-blue-500"
        >
          {mobileOpen ? "Close TOC" : "Open TOC"}
        </button>

        {mobileOpen ? (
          <div
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        ) : null}

        <aside
          aria-label="Mobile table of contents"
          className={`fixed bottom-0 left-0 right-0 z-40 max-h-[60vh] overflow-y-auto rounded-t-2xl border-t bg-white p-5 shadow-xl transition-transform dark:border-slate-800 dark:bg-slate-900 ${
            mobileOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Table of contents
          </h3>
          <ul className="space-y-2 text-sm">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={heading.level === 3 ? "ml-4" : ""}
              >
                <Link
                  href={`#${heading.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={
                    activeId === heading.id
                      ? "font-semibold text-slate-900 dark:text-slate-100"
                      : "text-slate-700 hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-slate-100"
                  }
                >
                  {heading.text}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
