"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, CreditCard } from "lucide-react";
import { formatCredits } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

interface DashboardHeaderProps {
  user: User;
  profile: any;
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold gradient-text">Lumora</span>
        </Link>

        <div className="flex items-center space-x-4">
          {/* Credits Display */}
          <div className="flex items-center space-x-2 rounded-md border bg-muted px-3 py-1.5">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {formatCredits(profile?.credits_balance || 0)} credits
            </span>
          </div>

          {/* Tier Badge */}
          <div className="rounded-md bg-primary/10 px-3 py-1.5">
            <span className="text-sm font-medium text-primary">
              {profile?.tier || "FREE"}
            </span>
          </div>

          {profile?.tier === "FREE" && (
            <Link href="/dashboard/pricing">
              <Button size="sm">Upgrade</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
