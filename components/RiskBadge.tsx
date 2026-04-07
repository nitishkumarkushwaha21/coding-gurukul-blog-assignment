import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

const tones: Record<RiskLevel, string> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  High: "border-rose-200 bg-rose-50 text-rose-800"
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <Badge className={cn("rounded-full px-3 py-1.5 text-sm", tones[level])}>
      {level} Risk
    </Badge>
  );
}
