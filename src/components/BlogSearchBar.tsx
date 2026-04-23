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
        className="h-12 w-full rounded-xl border border-slate-200 bg-white/95 pl-10 pr-4 text-sm text-slate-800 outline-none ring-0 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-950"
      />
    </form>
  );
}
