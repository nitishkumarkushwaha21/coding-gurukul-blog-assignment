import {
  AlertTriangle,
  BriefcaseBusiness,
  CircleSlash,
  CircleDollarSign,
  Cpu,
  Crosshair,
  LineChart,
  TrendingUp,
  Users
} from "lucide-react";

import { RiskBadge } from "@/components/RiskBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { IdeaRecord } from "@/types";

const sections = [
  { key: "problem", label: "Problem", icon: Crosshair },
  { key: "customer", label: "Target Customer", icon: Users },
  { key: "market", label: "Market Opportunity", icon: LineChart },
  { key: "competitors", label: "Competitors", icon: BriefcaseBusiness },
  { key: "tech_stack", label: "Suggested Tech Stack", icon: Cpu }
] as const;

function leadSentence(value: string) {
  const sentence = value.split(/(?<=[.!?])\s+/)[0]?.trim();
  return sentence && sentence.length > 0 ? sentence : value;
}

export function ReportFull({ idea }: { idea: IdeaRecord }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Validation Report</p>
              <CardTitle className="text-3xl leading-tight md:text-4xl">{idea.idea_text}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generated on {new Date(idea.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ScoreBadge score={idea.profit_score} />
              <RiskBadge level={idea.risk_level} />
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <TrendingUp className="h-4 w-4" />
                </span>
                Market signal
              </div>
              <p className="text-sm leading-6 text-slate-700">{leadSentence(idea.market)}</p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <BriefcaseBusiness className="h-4 w-4" />
                </span>
                Competitor snapshot
              </div>
              <p className="text-sm leading-6 text-slate-700">{leadSentence(idea.competitors)}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <CircleDollarSign className="h-4 w-4" />
                </span>
                Profit outlook
              </div>
              <p className="text-sm leading-6 text-slate-700">{idea.profit_reasoning}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                Risk summary
              </div>
              <p className="text-sm leading-6 text-slate-700">
                This idea currently scores as <span className="font-medium text-foreground">{idea.risk_level}</span>{" "}
                risk based on the generated validation report.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
                  <CircleSlash className="h-4 w-4" />
                </span>
                Core problem
              </div>
              <p className="text-sm leading-6 text-slate-700">{leadSentence(idea.problem)}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map(({ key, label, icon: Icon }) => (
          <Card key={key} className="h-full">
            <CardHeader>
              <div className="space-y-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border bg-muted text-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  {label}
                </CardTitle>
                <div className="h-px w-16 bg-foreground/20" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">{idea[key]}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
