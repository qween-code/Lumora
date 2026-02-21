/**
 * Unified Generation Engine
 * Consolidates the shared logic from image/video/audio API routes:
 *   auth → validate → credits check → create record → deduct → generate → update/refund
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { getModelConfig, getModelCredits, GenerationType } from "./model-registry";
import { generateWithFal } from "./fal-client";

interface GenerateOptions {
  supabase: SupabaseClient;
  userId: string;
  type: GenerationType;
  model: string;
  prompt: string;
  params: Record<string, any>;
}

interface GenerateResult {
  success: boolean;
  generation: any;
  error?: string;
}

export async function executeGeneration(options: GenerateOptions): Promise<GenerateResult> {
  const { supabase, userId, type, model, prompt, params } = options;

  // 1. Validate model exists
  const modelConfig = getModelConfig(model);
  if (!modelConfig) {
    throw new GenerationError("Unsupported model", 400);
  }

  if (modelConfig.type !== type) {
    throw new GenerationError(`Model ${model} is not a ${type} model`, 400);
  }

  // 2. Calculate credits
  const creditCost = getModelCredits(model, params);

  // 3. Check balance
  const { data: profile } = await supabase
    .from("users")
    .select("credits_balance, tier")
    .eq("id", userId)
    .single();

  if (!profile || profile.credits_balance < creditCost) {
    throw new GenerationError("Insufficient credits", 402);
  }

  // 4. Create generation record
  const { data: generation, error: genError } = await supabase
    .from("generations")
    .insert({
      user_id: userId,
      type,
      model,
      prompt,
      parameters: params,
      status: "pending",
      credits_used: creditCost,
      provider: modelConfig.provider,
    })
    .select()
    .single();

  if (genError) throw genError;

  // 5. Deduct credits atomically
  const { error: deductError } = await supabase.rpc("deduct_credits", {
    p_user_id: userId,
    p_amount: creditCost,
    p_type: "generation",
    p_reference_id: generation.id,
    p_description: `${type} generation: ${modelConfig.name}`,
  });

  if (deductError) {
    await supabase.from("generations").delete().eq("id", generation.id);
    throw deductError;
  }

  // 6. Execute AI generation
  try {
    const startTime = Date.now();

    await supabase
      .from("generations")
      .update({ status: "processing" })
      .eq("id", generation.id);

    // Build input using model config
    const input = modelConfig.buildInput({ prompt, ...params });

    // Call Fal.ai
    const result = await generateWithFal(modelConfig.endpoint, input);

    const generationTime = Date.now() - startTime;

    // Extract output URLs using model config
    const outputUrls = modelConfig.extractOutput(result);

    if (outputUrls.length === 0) {
      throw new Error("No output generated");
    }

    // Update generation record with results
    await supabase
      .from("generations")
      .update({
        status: "completed",
        output_urls: outputUrls,
        generation_time_ms: generationTime,
        completed_at: new Date().toISOString(),
      })
      .eq("id", generation.id);

    return {
      success: true,
      generation: {
        ...generation,
        output_urls: outputUrls,
        status: "completed",
      },
    };
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
      p_user_id: userId,
      p_amount: creditCost,
      p_type: "refund",
      p_reference_id: generation.id,
      p_description: `Refund for failed ${type} generation`,
    });

    throw aiError;
  }
}

export class GenerationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "GenerationError";
    this.statusCode = statusCode;
  }
}
