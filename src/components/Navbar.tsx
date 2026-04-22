"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur dark:bg-slate-950/90"
      aria-label="Site header"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100"
        >
          Blog CMS
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-5 text-sm font-medium text-slate-700 dark:text-slate-200 md:flex"
        >
          <Link href="/admin">Admin</Link>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="border-t bg-white px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 md:hidden"
        >
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="block py-1.5"
          >
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
