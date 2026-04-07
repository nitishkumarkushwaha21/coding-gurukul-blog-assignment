import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { deleteIdea, getIdeaById } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idea = await getIdeaById(params.id);

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    return NextResponse.json(idea);
  } catch (error) {
    console.error("Failed to fetch idea", error);
    return NextResponse.json({ error: "Failed to fetch idea" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteIdea(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    revalidatePath("/dashboard");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete idea", error);
    return NextResponse.json({ error: "Failed to delete idea" }, { status: 500 });
  }
}
