"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Download, Music } from "lucide-react";
import { AI_MODELS } from "@/lib/constants";

const VOICES = [
  { id: "rachel", name: "Rachel", description: "Warm, professional female" },
  { id: "adam", name: "Adam", description: "Deep, authoritative male" },
  { id: "bella", name: "Bella", description: "Friendly, casual female" },
  { id: "josh", name: "Josh", description: "Clear, energetic male" },
];

export default function AudioGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("stable-audio");
  const [duration, setDuration] = useState(10);
  const [voice, setVoice] = useState("rachel");
  const [loading, setLoading] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);

  const selectedModel = AI_MODELS.audio.find((m) => m.id === model);
  const isTTS = model === "elevenlabs-tts";

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
    setGeneratedAudio(null);

    try {
      const response = await fetch("/api/generate/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model,
          duration: isTTS ? undefined : duration,
          voice: isTTS ? voice : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      if (data.generation?.output_urls?.[0]) {
        setGeneratedAudio(data.generation.output_urls[0]);
        toast({
          title: "Success!",
          description: "Your audio has been generated",
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
      link.download = `lumora-audio-${Date.now()}.${isTTS ? "mp3" : "wav"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not download audio",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate Audio</h1>
        <p className="text-muted-foreground mt-2">
          Create music, sound effects, and speech with AI
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
        {/* Controls Panel */}
        <div className="space-y-6 rounded-lg border bg-card p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">
                {isTTS ? "Text to Speak" : "Prompt"}
              </Label>
              <Textarea
                id="prompt"
                placeholder={
                  isTTS
                    ? "Enter the text you want to convert to speech..."
                    : "Describe the audio you want to create (e.g., 'upbeat electronic music with synth melodies')..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                {isTTS
                  ? "Enter any text to convert to natural sounding speech"
                  : "Describe the style, mood, instruments, and genre"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select value={model} onValueChange={setModel} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.audio.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {m.credits} credits - {m.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isTTS ? (
              <div className="space-y-2">
                <Label htmlFor="voice">Voice</Label>
                <Select value={voice} onValueChange={setVoice} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICES.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        <div>
                          <div className="font-medium">{v.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {v.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Select
                  value={duration.toString()}
                  onValueChange={(value) => setDuration(parseInt(value))}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 seconds (2 credits)</SelectItem>
                    <SelectItem value="10">10 seconds (5 credits)</SelectItem>
                    <SelectItem value="15">15 seconds (5 credits)</SelectItem>
                    <SelectItem value="30">30 seconds (10 credits)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost:</span>
                <span className="font-semibold">
                  {selectedModel?.credits || 0} credits
                </span>
              </div>
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
                  Generating...
                </>
              ) : (
                <>
                  <Music className="mr-2 h-4 w-4" />
                  {isTTS ? "Generate Speech" : "Generate Audio"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>

          {loading ? (
            <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Generating your audio...
                </p>
              </div>
            </div>
          ) : generatedAudio ? (
            <div className="space-y-6">
              <div className="rounded-lg bg-muted p-8 flex flex-col items-center gap-6">
                <Music className="h-16 w-16 text-primary" />
                <audio
                  src={generatedAudio}
                  controls
                  className="w-full max-w-lg"
                  autoPlay
                />
                <Button
                  onClick={() => handleDownload(generatedAudio)}
                  variant="secondary"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Audio
                </Button>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-medium">Generation Details</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <span>Model:</span>
                  <span>{selectedModel?.name}</span>
                  <span>Type:</span>
                  <span>{isTTS ? "Text-to-Speech" : "Music/Audio"}</span>
                  {!isTTS && (
                    <>
                      <span>Duration:</span>
                      <span>{duration}s</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center space-y-2">
                <Music className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Your generated audio will appear here
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Create music, sound effects, or convert text to natural speech
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
