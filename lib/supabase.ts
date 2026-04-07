import { createClient } from "@supabase/supabase-js";

import { env, isUsingMockServices } from "@/lib/env";
import { createMockIdeaRecord, getMockIdeas } from "@/lib/mock-data";
import type { IdeaRecord } from "@/types";

export const supabase =
  !isUsingMockServices && env.supabaseUrl && env.supabaseAnonKey
    ? createClient(env.supabaseUrl, env.supabaseAnonKey)
    : null;

const mockIdeasStore = getMockIdeas();

function normalizeIdeaRecord(idea: Partial<IdeaRecord>): IdeaRecord {
  return {
    id: idea.id ?? "",
    created_at: idea.created_at ?? new Date().toISOString(),
    idea_text: idea.idea_text ?? "",
    problem: idea.problem ?? "",
    customer: idea.customer ?? "",
    market: idea.market ?? "",
    competitors: idea.competitors ?? "",
    tech_stack: idea.tech_stack ?? "",
    risk_level:
      idea.risk_level === "Low" || idea.risk_level === "Medium" || idea.risk_level === "High"
        ? idea.risk_level
        : "Medium",
    profit_score: typeof idea.profit_score === "number" ? idea.profit_score : 0,
    profit_reasoning: idea.profit_reasoning ?? "",
    raw_response: idea.raw_response ?? null
  };
}

export async function insertIdea(record: Omit<IdeaRecord, "id" | "created_at">) {
  if (!supabase) {
    const mock = createMockIdeaRecord(record.idea_text);
    const merged = { ...mock, ...record, id: mock.id, created_at: mock.created_at };
    mockIdeasStore.unshift(merged);
    return merged;
  }

  const insertPayload = {
    idea_text: record.idea_text,
    problem: record.problem,
    customer: record.customer,
    market: record.market,
    competitors: record.competitors,
    tech_stack: record.tech_stack,
    risk_level: record.risk_level,
    profit_score: record.profit_score,
    raw_response: record.raw_response,
    profit_reasoning: record.profit_reasoning
  };

  let { data, error } = await supabase.from("ideas").insert([insertPayload]).select().single();

  if (
    error &&
    (error.message.toLowerCase().includes("profit_reasoning") ||
      error.message.toLowerCase().includes("tech_stack"))
  ) {
    const retry = await supabase
      .from("ideas")
      .insert([
        {
          idea_text: record.idea_text,
          problem: record.problem,
          customer: record.customer,
          market: record.market,
          competitors: record.competitors,
          tech_stack: record.tech_stack,
          risk_level: record.risk_level,
          profit_score: record.profit_score,
          raw_response: record.raw_response
        }
      ])
      .select()
      .single();

    data = retry.data;
    error = retry.error;
  }

  if (error) {
    throw error;
  }

  return normalizeIdeaRecord({
    ...(data as Partial<IdeaRecord>),
    profit_reasoning: (data as Partial<IdeaRecord>).profit_reasoning ?? record.profit_reasoning
  });
}

export async function getIdeas() {
  if (!supabase) {
    return mockIdeasStore;
  }

  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as Partial<IdeaRecord>[]).map(normalizeIdeaRecord);
}

export async function getIdeaById(id: string) {
  if (!supabase) {
    return mockIdeasStore.find((idea) => idea.id === id) ?? null;
  }

  const { data, error } = await supabase.from("ideas").select("*").eq("id", id).single();

  if (error) {
    throw error;
  }

  return normalizeIdeaRecord(data as Partial<IdeaRecord>);
}

export async function deleteIdea(id: string) {
  if (!supabase) {
    const index = mockIdeasStore.findIndex((idea) => idea.id === id);

    if (index === -1) {
      return false;
    }

    mockIdeasStore.splice(index, 1);
    return true;
  }

  const { error } = await supabase.from("ideas").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}
