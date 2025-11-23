import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Image, Video, Music, Box, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // Fetch user profile and recent generations
  const [{ data: profile }, { data: recentGenerations }] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).single(),
    supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.name || user.email}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Create stunning AI content in seconds
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/generate/image">
          <div className="group cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 font-semibold">Generate Image</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create stunning images with AI
            </p>
          </div>
        </Link>

        <Link href="/dashboard/generate/video">
          <div className="group cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 font-semibold">Generate Video</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Professional videos in seconds
            </p>
          </div>
        </Link>

        <Link href="/dashboard/generate/audio">
          <div className="group cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 font-semibold">Generate Audio</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Text-to-speech and music
            </p>
          </div>
        </Link>

        <Link href="/dashboard/generate/3d">
          <div className="group cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Box className="h-6 w-6 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 font-semibold">Generate 3D</h3>
            <p className="text-sm text-muted-foreground mt-1">
              3D models from text or images
            </p>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Credits Remaining
          </h3>
          <p className="text-3xl font-bold mt-2">
            {profile?.credits_balance || 0}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Generations
          </h3>
          <p className="text-3xl font-bold mt-2">
            {recentGenerations?.length || 0}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Current Plan
          </h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-3xl font-bold">{profile?.tier || "FREE"}</p>
            {profile?.tier === "FREE" && (
              <Link href="/dashboard/pricing">
                <Button size="sm">Upgrade</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Recent Generations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Generations</h2>
          <Link href="/dashboard/history">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {recentGenerations && recentGenerations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentGenerations.map((generation: any) => (
              <div key={generation.id} className="rounded-lg border bg-card overflow-hidden">
                {generation.output_urls && generation.output_urls.length > 0 ? (
                  generation.type === "image" ? (
                    <img
                      src={generation.output_urls[0]}
                      alt={generation.prompt}
                      className="w-full h-48 object-cover"
                    />
                  ) : generation.type === "video" ? (
                    <video
                      src={generation.output_urls[0]}
                      className="w-full h-48 object-cover"
                      controls
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <Music className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      {generation.status === "pending" && "Generating..."}
                      {generation.status === "processing" && "Processing..."}
                      {generation.status === "failed" && "Failed"}
                    </p>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm font-medium line-clamp-2">
                    {generation.prompt}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground capitalize">
                      {generation.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {generation.credits_used} credits
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              No generations yet. Start creating!
            </p>
            <Link href="/dashboard/generate/image">
              <Button className="mt-4">Create Your First Generation</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
