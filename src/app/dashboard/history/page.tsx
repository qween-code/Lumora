import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatRelativeTime } from "@/lib/utils";
import { Image, Video, Music, Box, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // Fetch all generations
  const { data: generations } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const getIcon = (type: string) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "3d":
        return Box;
      default:
        return Image;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Generation History</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your AI generations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm">
          All
        </Button>
        <Button variant="ghost" size="sm">
          Images
        </Button>
        <Button variant="ghost" size="sm">
          Videos
        </Button>
        <Button variant="ghost" size="sm">
          Audio
        </Button>
        <Button variant="ghost" size="sm">
          3D
        </Button>
      </div>

      {/* Generations Grid */}
      {generations && generations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {generations.map((generation: any) => {
            const Icon = getIcon(generation.type);
            return (
              <div
                key={generation.id}
                className="rounded-lg border bg-card overflow-hidden group hover:shadow-lg transition-shadow"
              >
                {/* Preview */}
                <div className="relative aspect-video bg-muted flex items-center justify-center">
                  {generation.output_urls && generation.output_urls.length > 0 ? (
                    generation.type === "image" ? (
                      <img
                        src={generation.output_urls[0]}
                        alt={generation.prompt}
                        className="w-full h-full object-cover"
                      />
                    ) : generation.type === "video" ? (
                      <video
                        src={generation.output_urls[0]}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    ) : (
                      <Icon className="h-12 w-12 text-muted-foreground" />
                    )
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Icon className="h-12 w-12 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground capitalize">
                        {generation.status}
                      </p>
                    </div>
                  )}

                  {/* Status Badge */}
                  {generation.status !== "completed" && (
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          generation.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : generation.status === "processing"
                            ? "bg-blue-500/20 text-blue-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {generation.status}
                      </span>
                    </div>
                  )}

                  {/* Download Button */}
                  {generation.status === "completed" && generation.output_urls?.[0] && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={generation.output_urls[0]}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="secondary">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </a>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <p className="text-sm font-medium line-clamp-2">
                    {generation.prompt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="capitalize">{generation.type}</span>
                    <span>{generation.model}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatRelativeTime(generation.created_at)}</span>
                    <span>{generation.credits_used} credits</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center">
          <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No generations yet</h2>
          <p className="text-muted-foreground mb-6">
            Start creating amazing AI content
          </p>
          <Button>Create Your First Generation</Button>
        </div>
      )}
    </div>
  );
}
