import Link from "next/link";

interface PaginationProps {
  page: number;
  pageCount: number;
}

export function Pagination({ page, pageCount }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-3">
      <Link
        href={`/?page=${Math.max(1, page - 1)}`}
        className="rounded-lg border bg-white px-4 py-2 text-sm text-slate-700 disabled:pointer-events-none"
      >
        Previous
      </Link>
      <span className="text-sm text-slate-600">
        Page {page} of {pageCount}
      </span>
      <Link
        href={`/?page=${Math.min(pageCount, page + 1)}`}
        className="rounded-lg border bg-white px-4 py-2 text-sm text-slate-700"
      >
        Next
      </Link>
    </nav>
  );
}
