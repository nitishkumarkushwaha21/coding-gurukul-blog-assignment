// Displays a styled external link card for rich article embeds.
interface EmbedCardProps {
  href: string;
  label?: string;
  description?: string;
}

export function EmbedCard({ href, label = "Embedded Link", description }: EmbedCardProps) {
  return (
    <aside className="my-8 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-2 block break-all text-sm font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800"
      >
        {href}
      </a>
      {description ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      ) : null}
    </aside>
  );
}
