"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { IdeaRecord, ValidateIdeaPayload } from "@/types";

export function IdeaForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [idea, setIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!idea.trim()) {
      setError("Please describe the startup idea you want to validate.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload: ValidateIdeaPayload = { idea_text: idea.trim() };
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "Validation failed");
      }

      const data = (await response.json()) as IdeaRecord;
      router.push(`/report/${data.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-8">
        <div className="space-y-5">
          <CardTitle className="text-2xl md:text-3xl">Describe the startup idea</CardTitle>
          <div className="h-px w-full bg-foreground/20" />
        </div>
        <CardDescription className="max-w-2xl text-base leading-7">
          We&apos;ll generate a structured AI report with the core problem, market opportunity,
          competitor landscape, recommended stack, risk level, and profitability score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
          <Textarea
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            placeholder="Example: An AI-powered platform that helps local gyms convert trial users into members using personalized WhatsApp campaigns."
            className="min-h-[250px] w-full bg-background"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Analyzing your idea with AI...
                </>
              ) : (
                <>
                  Validate Now
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
