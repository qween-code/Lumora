import { type UserTier } from "@/types/database";

export const TIER_CREDITS: Record<UserTier, number> = {
  FREE: 100,
  CREATOR: 1000,
  PRO: 5000,
  ENTERPRISE: -1, // Unlimited
};

export const TIER_PRICES = {
  CREATOR: {
    monthly: 15,
    annual: 12, // $144/year (20% discount)
  },
  PRO: {
    monthly: 49,
    annual: 39, // $468/year (20% discount)
  },
};

export const CREDIT_COSTS = {
  // Image Generation
  image: {
    'flux-schnell': 2,
    'flux-pro': 5,
    'dall-e-3': 4,
    'sd-3.5-large': 3,
    'hunyuan-image-3': 3,
  },
  // Video Generation
  video: {
    'kling-2.5-turbo-5s-720p': 8,
    'kling-2.5-turbo-5s-1080p': 12,
    'veo-3-5s-1080p': 12,
    'veo-3-10s-1080p': 24,
    'wan-2.5-10s-1080p': 20,
    'sora-10s-1080p': 25,
  },
  // Audio Generation
  audio: {
    'tts-1min': 5,
    'music-30s': 10,
    'sound-effect': 2,
  },
  // 3D Generation
  '3d': {
    'text-to-3d-simple': 15,
    'image-to-3d': 20,
    '3d-with-texture': 30,
  },
} as const;

export const TIER_LIMITS = {
  FREE: {
    maxResolution: '720p',
    videoDuration: 5,
    watermark: true,
    commercialUse: false,
    teamMembers: 1,
    storage: 1, // GB
    apiAccess: false,
    priorityQueue: false,
    customModels: false,
    whiteLabel: false,
    concurrentJobs: 1,
    analytics: false,
  },
  CREATOR: {
    maxResolution: '1080p',
    videoDuration: 10,
    watermark: false,
    commercialUse: true,
    teamMembers: 1,
    storage: 50, // GB
    apiAccess: false,
    priorityQueue: false,
    customModels: false,
    whiteLabel: false,
    concurrentJobs: 2,
    analytics: 'basic',
  },
  PRO: {
    maxResolution: '4K',
    videoDuration: 30,
    watermark: false,
    commercialUse: true,
    teamMembers: 5,
    storage: 500, // GB
    apiAccess: true,
    priorityQueue: true,
    customModels: false,
    whiteLabel: false,
    concurrentJobs: 5,
    analytics: 'advanced',
  },
  ENTERPRISE: {
    maxResolution: '4K+',
    videoDuration: 60,
    watermark: false,
    commercialUse: true,
    teamMembers: -1, // Unlimited
    storage: -1, // Unlimited
    apiAccess: true,
    priorityQueue: true,
    customModels: true,
    whiteLabel: true,
    concurrentJobs: 20,
    analytics: 'enterprise',
  },
} as const;

export const AI_MODELS = {
  image: [
    {
      id: 'flux-schnell',
      name: 'FLUX.1 Schnell',
      provider: 'fal-ai',
      description: 'Fast, affordable image generation',
      credits: 2,
    },
    {
      id: 'flux-pro',
      name: 'FLUX.1 Pro',
      provider: 'fal-ai',
      description: 'Best quality image generation',
      credits: 5,
    },
    {
      id: 'dall-e-3',
      name: 'DALL-E 3',
      provider: 'openai',
      description: 'Best text rendering in images',
      credits: 4,
    },
    {
      id: 'sd-3.5-large',
      name: 'Stable Diffusion 3.5 Large',
      provider: 'replicate',
      description: 'Open source, highly customizable',
      credits: 3,
    },
  ],
  video: [
    {
      id: 'kling-2.5-turbo',
      name: 'Kling 2.5 Turbo',
      provider: 'fal-ai',
      description: 'Fast, best physics simulation',
      credits: 8,
    },
    {
      id: 'veo-3',
      name: 'Veo 3',
      provider: 'fal-ai',
      description: 'Cinematic quality with native audio',
      credits: 12,
    },
    {
      id: 'wan-2.5',
      name: 'WAN 2.5',
      provider: 'fal-ai',
      description: 'Consistent characters across scenes',
      credits: 20,
    },
  ],
  audio: [
    {
      id: 'elevenlabs-tts',
      name: 'ElevenLabs TTS',
      provider: 'elevenlabs',
      description: 'Natural text-to-speech',
      credits: 5,
    },
    {
      id: 'stable-audio',
      name: 'Stable Audio',
      provider: 'stability-ai',
      description: 'Music and sound generation',
      credits: 10,
    },
  ],
} as const;

export const TEMPLATE_CATEGORIES = [
  'e-commerce',
  'social-media',
  'real-estate',
  'fashion',
  'food',
  'travel',
  'education',
  'marketing',
  'gaming',
  'other',
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
