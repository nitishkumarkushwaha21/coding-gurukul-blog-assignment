import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { validateStartupIdea } from "@/lib/claude";
import { insertIdea } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { idea_text?: string };
    const ideaText = body.idea_text?.trim();

    if (!ideaText) {
      return NextResponse.json({ error: "idea_text is required" }, { status: 400 });
    }

    const report = await validateStartupIdea(ideaText);
    const savedIdea = await insertIdea({
      idea_text: ideaText,
      ...report,
      raw_response: JSON.stringify(report)
    });

    revalidatePath("/dashboard");
    revalidatePath(`/report/${savedIdea.id}`);

    return NextResponse.json(savedIdea);
  } catch (error) {
    console.error("Validation failed", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Validation failed"
      },
      { status: 500 }
    );
  }
}
