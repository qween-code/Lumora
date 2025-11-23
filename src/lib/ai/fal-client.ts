import * as fal from "@fal-ai/client";

// Initialize Fal.ai client
export function initializeFalClient() {
  if (typeof window === "undefined") {
    // Server-side
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });
  }
}

// Image generation with FLUX
export async function generateImageWithFlux(params: {
  prompt: string;
  model: "flux-schnell" | "flux-pro";
  width?: number;
  height?: number;
  num_images?: number;
}) {
  initializeFalClient();

  const modelId =
    params.model === "flux-schnell"
      ? "fal-ai/flux/schnell"
      : "fal-ai/flux/dev";

  const result = await fal.subscribe(modelId, {
    input: {
      prompt: params.prompt,
      image_size: `${params.width || 1024}x${params.height || 1024}`,
      num_images: params.num_images || 1,
    },
  });

  return result;
}

// Video generation with Kling
export async function generateVideoWithKling(params: {
  prompt: string;
  duration?: 5 | 10;
  aspect_ratio?: "16:9" | "9:16" | "1:1";
}) {
  initializeFalClient();

  const result = await fal.subscribe("fal-ai/kling-video/v1.5/pro/text-to-video", {
    input: {
      prompt: params.prompt,
      duration: params.duration || 5,
      aspect_ratio: params.aspect_ratio || "16:9",
    },
  });

  return result;
}

// Video generation with Veo 3
export async function generateVideoWithVeo(params: {
  prompt: string;
  duration?: 5 | 10;
  aspect_ratio?: "16:9" | "9:16" | "1:1";
}) {
  initializeFalClient();

  const result = await fal.subscribe("fal-ai/veo-3", {
    input: {
      prompt: params.prompt,
      duration: params.duration || 5,
      aspect_ratio: params.aspect_ratio || "16:9",
    },
  });

  return result;
}

// Generic Fal.ai generation
export async function generateWithFal(
  modelId: string,
  input: Record<string, any>
) {
  initializeFalClient();

  const result = await fal.subscribe(modelId, {
    input,
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log("Generation progress:", update.logs);
      }
    },
  });

  return result;
}
