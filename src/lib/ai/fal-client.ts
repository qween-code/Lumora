import { fal } from "@fal-ai/client";

// Initialize Fal.ai client
export function initializeFalClient() {
  if (typeof window === "undefined") {
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });
  }
}

// Generic Fal.ai generation - used by the unified generation engine
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
