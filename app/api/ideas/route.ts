import { NextResponse } from "next/server";

import { getIdeas } from "@/lib/supabase";

export async function GET() {
  try {
    const ideas = await getIdeas();
    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Failed to fetch ideas", error);
    return NextResponse.json({ error: "Failed to fetch ideas" }, { status: 500 });
  }
}
