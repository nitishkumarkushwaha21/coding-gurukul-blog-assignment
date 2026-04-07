import type { IdeaRecord, ValidationReport } from "@/types";

function buildReport(_ideaText: string): ValidationReport {
  return {
    problem:
      "Founders often struggle to pressure-test startup ideas quickly, which leads to wasted build time and unclear market positioning. This validator creates a structured first-pass analysis before engineering effort is committed.",
    customer:
      "Early-stage founders, indie hackers, and small product teams exploring new bets are the primary users. They care about speed, clarity, and concrete feedback that helps them decide whether to refine, pivot, or proceed.",
    market:
      "AI-assisted research and validation tools continue to grow as more solo founders and lean teams ship products online. This idea fits a broad pre-launch workflow where fast decision support is valuable and repeatable.",
    competitors:
      "Potential competitors include generic AI chat workflows, startup coaching products, and business-plan generators. Differentiation comes from structured outputs, saved report history, and a purpose-built founder experience.",
    tech_stack:
      "Next.js for the web app, Supabase for database and auth, OpenRouter-backed LLM inference for idea analysis, and Vercel for deployment would be a lean MVP stack.",
    risk_level: "Medium",
    profit_score: 72,
    profit_reasoning:
      "There is clear demand for faster validation workflows, but retention depends on evolving beyond one-off scoring into a repeatable founder toolkit.",
  };
}

export function createMockIdeaRecord(ideaText: string): IdeaRecord {
  const report = buildReport(ideaText);

  return {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    idea_text: ideaText,
    raw_response: JSON.stringify(report),
    ...report,
  };
}

export function getMockIdeas(): IdeaRecord[] {
  return [
    createMockIdeaRecord(
      "An AI co-pilot that helps small D2C brands turn customer reviews into ad copy and product positioning.",
    ),
    createMockIdeaRecord(
      "A voice-first personal CRM for freelancers to capture follow-ups and relationship notes after meetings.",
    ),
  ];
}
