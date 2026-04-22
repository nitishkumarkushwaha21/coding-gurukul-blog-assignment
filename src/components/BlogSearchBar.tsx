import { Search } from "lucide-react";

export function BlogSearchBar({
  q = "",
  tag = "",
}: {
  q?: string;
  tag?: string;
}) {
  return (
    <form method="GET" className="relative block" aria-label="Search blogs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input type="hidden" name="page" value="1" />
      {tag ? <input type="hidden" name="tag" value={tag} /> : null}
      <input
        name="q"
        defaultValue={q}
        placeholder="Search by title or tag..."
        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none ring-blue-200 transition focus:ring dark:border-slate-800 dark:bg-slate-900"
      />
    </form>
  );
}
