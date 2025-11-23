"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Download, Video as VideoIcon } from "lucide-react";
import { AI_MODELS } from "@/lib/constants";

export default function VideoGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("kling-2.5-turbo");
  const [duration, setDuration] = useState<5 | 10>(5);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [loading, setLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  const selectedModel = AI_MODELS.video.find((m) => m.id === model);
  const creditCost = selectedModel?.credits || 0;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prompt",
      });
      return;
    }

    setLoading(true);
    setGeneratedVideo(null);

    try {
      const response = await fetch("/api/generate/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model,
          duration,
          aspect_ratio: aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      if (data.generation?.output_urls?.[0]) {
        setGeneratedVideo(data.generation.output_urls[0]);
        toast({
          title: "Success!",
          description: "Your video has been generated",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `lumora-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not download video",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate Video</h1>
        <p className="text-muted-foreground mt-2">
          Create professional videos with AI
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
        {/* Controls Panel */}
        <div className="space-y-6 rounded-lg border bg-card p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Describe the video you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Be descriptive about motion, camera movement, and scene details
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select value={model} onValueChange={setModel} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.video.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {m.credits} credits • {m.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={duration.toString()}
                onValueChange={(value) => setDuration(parseInt(value) as 5 | 10)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 seconds (8-12 credits)</SelectItem>
                  <SelectItem value="10">10 seconds (20-24 credits)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aspect">Aspect Ratio</Label>
              <Select
                value={aspectRatio}
                onValueChange={setAspectRatio}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                  <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated Cost:</span>
                <span className="font-semibold">
                  {duration === 5 ? creditCost : creditCost * 2} credits
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Generation time: ~2-5 minutes
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating... (this may take a few minutes)
                </>
              ) : (
                <>
                  <VideoIcon className="mr-2 h-4 w-4" />
                  Generate Video
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>

          {loading ? (
            <div className="flex h-[600px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Generating your video...
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  This typically takes 2-5 minutes. Please don't close this page.
                </p>
              </div>
            </div>
          ) : generatedVideo ? (
            <div className="space-y-4">
              <div className="relative group">
                <video
                  src={generatedVideo}
                  controls
                  className="w-full rounded-lg"
                  autoPlay
                  loop
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => handleDownload(generatedVideo)}
                    size="sm"
                    variant="secondary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-[600px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center space-y-2">
                <VideoIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Your generated video will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
