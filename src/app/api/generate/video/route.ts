import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateVideoWithKling, generateVideoWithVeo } from "@/lib/ai/fal-client";
import { CREDIT_COSTS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { prompt, model, duration, aspect_ratio } = body;

    if (!prompt || !model) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate credits needed
    const creditKey = `${model}-${duration}s-1080p` as keyof typeof CREDIT_COSTS.video;
    const creditCost = CREDIT_COSTS.video[creditKey] || 20;

    // Get user profile
    const { data: profile } = await supabase
      .from("users")
      .select("credits_balance")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits_balance < creditCost) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    // Create generation record
    const { data: generation, error: genError } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        type: "video",
        model,
        prompt,
        parameters: { duration, aspect_ratio },
        status: "pending",
        credits_used: creditCost,
        provider: "fal-ai",
      })
      .select()
      .single();

    if (genError) throw genError;

    // Deduct credits
    const { error: deductError } = await supabase.rpc("deduct_credits", {
      p_user_id: user.id,
      p_amount: creditCost,
      p_type: "generation",
      p_reference_id: generation.id,
      p_description: `Video generation: ${model}`,
    });

    if (deductError) {
      await supabase.from("generations").delete().eq("id", generation.id);
      throw deductError;
    }

    // Generate video
    try {
      const startTime = Date.now();

      // Update status to processing
      await supabase
        .from("generations")
        .update({ status: "processing" })
        .eq("id", generation.id);

      let result;
      if (model === "kling-2.5-turbo") {
        result = await generateVideoWithKling({
          prompt,
          duration: duration as 5 | 10,
          aspect_ratio,
        });
      } else if (model === "veo-3") {
        result = await generateVideoWithVeo({
          prompt,
          duration: duration as 5 | 10,
          aspect_ratio,
        });
      } else {
        throw new Error("Unsupported model");
      }

      const generationTime = Date.now() - startTime;

      // Update generation with results
      await supabase
        .from("generations")
        .update({
          status: "completed",
          output_urls: [result.data.video.url],
          generation_time_ms: generationTime,
          completed_at: new Date().toISOString(),
        })
        .eq("id", generation.id);

      return NextResponse.json({
        success: true,
        generation: {
          ...generation,
          output_urls: [result.data.video.url],
          status: "completed",
        },
      });
    } catch (aiError: any) {
      // Update generation as failed
      await supabase
        .from("generations")
        .update({
          status: "failed",
          error_message: aiError.message,
        })
        .eq("id", generation.id);

      // Refund credits
      await supabase.rpc("add_credits", {
        p_user_id: user.id,
        p_amount: creditCost,
        p_type: "refund",
        p_reference_id: generation.id,
        p_description: "Refund for failed generation",
      });

      throw aiError;
    }
  } catch (error: any) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: error.message || "Generation failed" },
      { status: 500 }
    );
  }
}
