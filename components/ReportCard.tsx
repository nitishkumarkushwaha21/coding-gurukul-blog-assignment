import Link from "next/link";

import { RiskBadge } from "@/components/RiskBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { truncateText } from "@/lib/utils";
import type { IdeaRecord } from "@/types";

export function ReportCard({ idea }: { idea: IdeaRecord }) {
  return (
    <Card className="h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-glow">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <ScoreBadge score={idea.profit_score} />
          <RiskBadge level={idea.risk_level} />
        </div>
        <CardTitle className="text-lg leading-7">{truncateText(idea.idea_text, 100)}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{truncateText(idea.problem, 140)}</p>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(idea.created_at).toLocaleDateString()}
        </span>
        <Button asChild size="sm">
          <Link href={`/report/${idea.id}`}>View Full Report</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
