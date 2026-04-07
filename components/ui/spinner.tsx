import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary",
        className
      )}
      aria-hidden="true"
    />
  );
}
