/**
 * Centralized AI Model Registry
 * Maps model IDs to their Fal.ai endpoints, parameters, and credit costs.
 */

export type GenerationType = "image" | "video" | "audio" | "3d";

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  type: GenerationType;
  credits: number;
  description: string;
  minTier: "FREE" | "CREATOR" | "PRO" | "ENTERPRISE";
  buildInput: (params: Record<string, any>) => Record<string, any>;
  extractOutput: (result: any) => string[];
}

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  // === IMAGE MODELS ===
  "flux-schnell": {
    id: "flux-schnell",
    name: "FLUX.1 Schnell",
    provider: "fal-ai",
    endpoint: "fal-ai/flux/schnell",
    type: "image",
    credits: 2,
    description: "Fast, affordable image generation",
    minTier: "FREE",
    buildInput: (params) => ({
      prompt: params.prompt,
      image_size: `${params.width || 1024}x${params.height || 1024}`,
      num_images: params.num_images || 1,
    }),
    extractOutput: (result) =>
      result.data?.images?.map((img: any) => img.url) || [],
  },

  "flux-pro": {
    id: "flux-pro",
    name: "FLUX.1 Pro",
    provider: "fal-ai",
    endpoint: "fal-ai/flux/dev",
    type: "image",
    credits: 5,
    description: "Best quality image generation",
    minTier: "FREE",
    buildInput: (params) => ({
      prompt: params.prompt,
      image_size: `${params.width || 1024}x${params.height || 1024}`,
      num_images: params.num_images || 1,
    }),
    extractOutput: (result) =>
      result.data?.images?.map((img: any) => img.url) || [],
  },

  "hunyuan-image-3": {
    id: "hunyuan-image-3",
    name: "Hunyuan Image 3",
    provider: "fal-ai",
    endpoint: "fal-ai/hunyuan-image-3",
    type: "image",
    credits: 3,
    description: "High-quality image generation with strong text rendering",
    minTier: "FREE",
    buildInput: (params) => ({
      prompt: params.prompt,
      image_size: `${params.width || 1024}x${params.height || 1024}`,
      num_images: params.num_images || 1,
    }),
    extractOutput: (result) =>
      result.data?.images?.map((img: any) => img.url) || [],
  },

  // === VIDEO MODELS ===
  "kling-2.5-turbo": {
    id: "kling-2.5-turbo",
    name: "Kling 2.5 Turbo",
    provider: "fal-ai",
    endpoint: "fal-ai/kling-video/v2.5/pro/text-to-video",
    type: "video",
    credits: 8,
    description: "Fast, best physics simulation",
    minTier: "FREE",
    buildInput: (params) => ({
      prompt: params.prompt,
      duration: params.duration || 5,
      aspect_ratio: params.aspect_ratio || "16:9",
    }),
    extractOutput: (result) =>
      result.data?.video?.url ? [result.data.video.url] : [],
  },

  "veo-3": {
    id: "veo-3",
    name: "Veo 3",
    provider: "fal-ai",
    endpoint: "fal-ai/veo-3",
    type: "video",
    credits: 12,
    description: "Cinematic quality with native audio",
    minTier: "CREATOR",
    buildInput: (params) => ({
      prompt: params.prompt,
      duration: params.duration || 5,
      aspect_ratio: params.aspect_ratio || "16:9",
    }),
    extractOutput: (result) =>
      result.data?.video?.url ? [result.data.video.url] : [],
  },

  "wan-2.5": {
    id: "wan-2.5",
    name: "WAN 2.5",
    provider: "fal-ai",
    endpoint: "fal-ai/wan/v2.5/text-to-video",
    type: "video",
    credits: 20,
    description: "Consistent characters across scenes",
    minTier: "CREATOR",
    buildInput: (params) => ({
      prompt: params.prompt,
      duration: params.duration || 5,
      aspect_ratio: params.aspect_ratio || "16:9",
    }),
    extractOutput: (result) =>
      result.data?.video?.url ? [result.data.video.url] : [],
  },

  // === AUDIO MODELS ===
  "stable-audio": {
    id: "stable-audio",
    name: "Stable Audio",
    provider: "fal-ai",
    endpoint: "fal-ai/stable-audio",
    type: "audio",
    credits: 10,
    description: "Music and sound generation",
    minTier: "FREE",
    buildInput: (params) => ({
      prompt: params.prompt,
      duration_in_seconds: params.duration || 10,
    }),
    extractOutput: (result) => {
      const url =
        result.data?.audio?.url ||
        result.data?.audio_file?.url ||
        result.data?.output?.url;
      return url ? [url] : [];
    },
  },

  "elevenlabs-tts": {
    id: "elevenlabs-tts",
    name: "ElevenLabs TTS",
    provider: "fal-ai",
    endpoint: "fal-ai/elevenlabs/tts",
    type: "audio",
    credits: 5,
    description: "Natural text-to-speech",
    minTier: "FREE",
    buildInput: (params) => ({
      text: params.prompt,
      voice: params.voice || "rachel",
    }),
    extractOutput: (result) => {
      const url =
        result.data?.audio?.url ||
        result.data?.audio_file?.url ||
        result.data?.output?.url;
      return url ? [url] : [];
    },
  },
};

/**
 * Get a model config by ID
 */
export function getModelConfig(modelId: string): ModelConfig | null {
  return MODEL_REGISTRY[modelId] || null;
}

/**
 * Get all models for a specific generation type
 */
export function getModelsByType(type: GenerationType): ModelConfig[] {
  return Object.values(MODEL_REGISTRY).filter((m) => m.type === type);
}

/**
 * Get credit cost for a model (with optional multiplier for duration etc.)
 */
export function getModelCredits(modelId: string, params?: Record<string, any>): number {
  const model = MODEL_REGISTRY[modelId];
  if (!model) return 0;

  // For video models, double credits for 10s duration
  if (model.type === "video" && params?.duration === 10) {
    return model.credits * 2;
  }

  // For image models, multiply by number of images
  if (model.type === "image" && params?.num_images && params.num_images > 1) {
    return model.credits * params.num_images;
  }

  return model.credits;
}
