import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 8
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : score >= 5
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <Badge className={cn("gap-2 rounded-full px-3 py-1.5 text-sm", tone)}>
      <span
        className={cn(
          "inline-block h-2.5 w-2.5 rounded-full",
          score >= 8 ? "bg-emerald-500" : score >= 5 ? "bg-amber-500" : "bg-rose-500"
        )}
      />
      {score}/10 Score
    </Badge>
  );
}
