import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { executeGeneration, GenerationError } from "@/lib/ai/generate";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, model, duration, voice } = await request.json();

    if (!prompt || !model) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await executeGeneration({
      supabase,
      userId: user.id,
      type: "audio",
      model,
      prompt,
      params: { duration, voice },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Audio generation error:", error);
    const status = error instanceof GenerationError ? error.statusCode : 500;
    return NextResponse.json(
      { error: error.message || "Generation failed" },
      { status }
    );
  }
}
