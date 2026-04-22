import Link from "next/link";

export function TagBadge({ tag }: { tag: string }) {
  return (
    <Link
      href={`/?tag=${encodeURIComponent(tag)}`}
      className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
    >
      #{tag}
    </Link>
  );
}
