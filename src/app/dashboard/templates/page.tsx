"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Image,
  Video,
  Music,
  ShoppingBag,
  Megaphone,
  Home,
  Utensils,
  Plane,
  GraduationCap,
  Gamepad2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { TEMPLATE_CATEGORIES } from "@/lib/constants";

type TemplateCategory = typeof TEMPLATE_CATEGORIES[number] | "all";

const CATEGORY_ICONS: Record<string, any> = {
  "e-commerce": ShoppingBag,
  "social-media": Megaphone,
  "real-estate": Home,
  "fashion": Sparkles,
  "food": Utensils,
  "travel": Plane,
  "education": GraduationCap,
  "marketing": Megaphone,
  "gaming": Gamepad2,
  "other": Sparkles,
};

// Pre-built templates
const TEMPLATES = [
  {
    id: "product-hero",
    name: "Product Hero Shot",
    description: "Professional product photography with studio lighting",
    category: "e-commerce",
    type: "image",
    prompt: "Professional product photography, studio lighting, white background, high-end commercial quality, 8k resolution",
    thumbnail: null,
    credits: 5,
    uses: 2840,
  },
  {
    id: "social-reel",
    name: "Social Media Reel",
    description: "Engaging short-form video for Instagram/TikTok",
    category: "social-media",
    type: "video",
    prompt: "Dynamic social media reel with trendy transitions, vibrant colors, vertical format 9:16",
    thumbnail: null,
    credits: 12,
    uses: 1520,
  },
  {
    id: "podcast-intro",
    name: "Podcast Intro Music",
    description: "Professional intro music for podcasts",
    category: "marketing",
    type: "audio",
    prompt: "Professional podcast intro music, upbeat and modern, 10 seconds, clean mix, radio quality",
    thumbnail: null,
    credits: 5,
    uses: 890,
  },
  {
    id: "real-estate-tour",
    name: "Virtual Property Tour",
    description: "Cinematic walkthrough video for real estate listings",
    category: "real-estate",
    type: "video",
    prompt: "Cinematic real estate walkthrough, smooth camera movement, warm golden hour lighting, luxury interior",
    thumbnail: null,
    credits: 20,
    uses: 670,
  },
  {
    id: "fashion-lookbook",
    name: "Fashion Lookbook",
    description: "High-fashion editorial style images",
    category: "fashion",
    type: "image",
    prompt: "High fashion editorial photograph, professional model, minimalist background, Vogue style, soft lighting",
    thumbnail: null,
    credits: 5,
    uses: 1230,
  },
  {
    id: "food-ad",
    name: "Food Photography",
    description: "Appetizing food photography for menus and ads",
    category: "food",
    type: "image",
    prompt: "Professional food photography, appetizing presentation, warm lighting, shallow depth of field, restaurant quality",
    thumbnail: null,
    credits: 3,
    uses: 2100,
  },
  {
    id: "travel-highlight",
    name: "Travel Highlight Reel",
    description: "Dynamic travel montage video",
    category: "travel",
    type: "video",
    prompt: "Cinematic travel montage, drone shots, golden hour, epic landscapes, wanderlust vibes",
    thumbnail: null,
    credits: 15,
    uses: 980,
  },
  {
    id: "edu-explainer",
    name: "Educational Explainer",
    description: "Clear educational explainer video style",
    category: "education",
    type: "video",
    prompt: "Clean educational explainer animation, flat design, clear visuals, professional narration style",
    thumbnail: null,
    credits: 12,
    uses: 560,
  },
  {
    id: "game-trailer",
    name: "Game Trailer",
    description: "Epic game trailer with cinematic effects",
    category: "gaming",
    type: "video",
    prompt: "Epic game trailer, cinematic camera, dramatic lighting, particle effects, AAA quality",
    thumbnail: null,
    credits: 25,
    uses: 340,
  },
  {
    id: "brand-jingle",
    name: "Brand Jingle",
    description: "Catchy brand jingle for ads",
    category: "marketing",
    type: "audio",
    prompt: "Catchy brand jingle, memorable melody, upbeat tempo, commercial quality, 15 seconds",
    thumbnail: null,
    credits: 10,
    uses: 450,
  },
  {
    id: "product-demo",
    name: "Product Demo Video",
    description: "Clean product demonstration video",
    category: "e-commerce",
    type: "video",
    prompt: "Clean product demonstration, 360 rotation, studio lighting, minimalist background, professional presentation",
    thumbnail: null,
    credits: 15,
    uses: 1890,
  },
  {
    id: "lifestyle-photo",
    name: "Lifestyle Photography",
    description: "Natural lifestyle product photography",
    category: "e-commerce",
    type: "image",
    prompt: "Natural lifestyle product photography, in-context usage, warm natural lighting, authentic feel",
    thumbnail: null,
    credits: 3,
    uses: 1650,
  },
];

const TYPE_ICONS: Record<string, any> = {
  image: Image,
  video: Video,
  audio: Music,
};

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesType = selectedType === "all" || template.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleUseTemplate = async (template: typeof TEMPLATES[0]) => {
    setLoadingTemplate(template.id);
    try {
      const response = await fetch(`/api/generate/${template.type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: template.prompt,
          model: template.type === "image" ? "flux-schnell" : template.type === "video" ? "kling-2.5-turbo" : "stable-audio",
          ...(template.type === "video" ? { duration: 5, aspect_ratio: "16:9" } : {}),
          ...(template.type === "audio" ? { duration: 10 } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      toast({
        title: "Generation started!",
        description: `Your ${template.type} is being generated using the "${template.name}" template`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error.message || "Something went wrong",
      });
    } finally {
      setLoadingTemplate(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Template Marketplace</h1>
        <p className="text-muted-foreground mt-2">
          Start with pre-built templates to create professional content faster
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("all")}
          >
            All Types
          </Button>
          {["image", "video", "audio"].map((type) => {
            const Icon = TYPE_ICONS[type];
            return (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                <Icon className="h-4 w-4 mr-1" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All Categories
          </Button>
          {TEMPLATE_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => {
            const TypeIcon = TYPE_ICONS[template.type] || Image;
            const CategoryIcon = CATEGORY_ICONS[template.category] || Sparkles;

            return (
              <div
                key={template.id}
                className="rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <TypeIcon className="h-12 w-12 text-muted-foreground" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className="bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium capitalize">
                      {template.type}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CategoryIcon className="h-3 w-3" />
                      <span className="capitalize">
                        {template.category.split("-").join(" ")}
                      </span>
                    </div>
                    <span>{template.uses.toLocaleString()} uses</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      {template.credits} credits
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleUseTemplate(template)}
                      disabled={loadingTemplate === template.id}
                    >
                      {loadingTemplate === template.id ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Use Template"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No templates found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
