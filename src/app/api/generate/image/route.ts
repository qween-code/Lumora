import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateImageWithFlux } from "@/lib/ai/fal-client";
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
    const { prompt, model, width, height, num_images } = body;

    if (!prompt || !model) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate credits needed
    const creditCost =
      CREDIT_COSTS.image[model as keyof typeof CREDIT_COSTS.image] || 5;
    const totalCredits = creditCost * (num_images || 1);

    // Get user profile
    const { data: profile } = await supabase
      .from("users")
      .select("credits_balance")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits_balance < totalCredits) {
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
        type: "image",
        model,
        prompt,
        parameters: { width, height, num_images },
        status: "pending",
        credits_used: totalCredits,
        provider: "fal-ai",
      })
      .select()
      .single();

    if (genError) throw genError;

    // Deduct credits
    const { error: deductError } = await supabase.rpc("deduct_credits", {
      p_user_id: user.id,
      p_amount: totalCredits,
      p_type: "generation",
      p_reference_id: generation.id,
      p_description: `Image generation: ${model}`,
    });

    if (deductError) {
      // Rollback generation record
      await supabase.from("generations").delete().eq("id", generation.id);
      throw deductError;
    }

    // Generate image
    try {
      const startTime = Date.now();

      // Update status to processing
      await supabase
        .from("generations")
        .update({ status: "processing" })
        .eq("id", generation.id);

      const result = await generateImageWithFlux({
        prompt,
        model,
        width,
        height,
        num_images,
      });

      const generationTime = Date.now() - startTime;

      // Update generation with results
      await supabase
        .from("generations")
        .update({
          status: "completed",
          output_urls: result.data.images.map((img: any) => img.url),
          generation_time_ms: generationTime,
          completed_at: new Date().toISOString(),
        })
        .eq("id", generation.id);

      return NextResponse.json({
        success: true,
        generation: {
          ...generation,
          output_urls: result.data.images.map((img: any) => img.url),
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
        p_amount: totalCredits,
        p_type: "refund",
        p_reference_id: generation.id,
        p_description: "Refund for failed generation",
      });

      throw aiError;
    }
  } catch (error: any) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error.message || "Generation failed" },
      { status: 500 }
    );
  }
}
