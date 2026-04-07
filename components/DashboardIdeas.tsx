"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { RiskBadge } from "@/components/RiskBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { truncateText } from "@/lib/utils";
import type { IdeaRecord } from "@/types";

function DashboardIdeaCard({
  idea,
  onDelete
}: {
  idea: IdeaRecord;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(idea.id);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card className="h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-glow">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <ScoreBadge score={idea.profit_score} />
            <RiskBadge level={idea.risk_level} />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Delete report"
          >
            {isDeleting ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
          </Button>
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

export function DashboardIdeas({ initialIdeas }: { initialIdeas: IdeaRecord[] }) {
  const [ideas, setIdeas] = useState(initialIdeas);

  async function handleDelete(id: string) {
    const previousIdeas = ideas;
    setIdeas((current) => current.filter((idea) => idea.id !== id));

    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "Delete failed");
      }
    } catch (error) {
      setIdeas(previousIdeas);
      window.alert(error instanceof Error ? error.message : "Delete failed");
    }
  }

  if (ideas.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No ideas yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your validated startup ideas will appear here once you submit the first one.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {ideas.map((idea) => (
        <DashboardIdeaCard key={idea.id} idea={idea} onDelete={handleDelete} />
      ))}
    </div>
  );
}
