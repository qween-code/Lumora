"use client";

import { BarChart3, TrendingUp, Eye, MousePointerClick, DollarSign } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track performance and ROI of your AI-generated content
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Generations</p>
              <p className="text-2xl font-bold mt-2">0</p>
              <p className="text-xs text-muted-foreground mt-1">
                +0% from last month
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold mt-2">0</p>
              <p className="text-xs text-muted-foreground mt-1">
                +0% from last month
              </p>
            </div>
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Click-Through Rate</p>
              <p className="text-2xl font-bold mt-2">0%</p>
              <p className="text-xs text-muted-foreground mt-1">
                +0% from last month
              </p>
            </div>
            <MousePointerClick className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ROI</p>
              <p className="text-2xl font-bold mt-2">$0</p>
              <p className="text-xs text-muted-foreground mt-1">
                +0% from last month
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Pro Feature Upsell */}
      <div className="rounded-lg border bg-card p-12 text-center">
        <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Unlock Advanced Analytics</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Track views, clicks, conversions, and ROI with advanced analytics. Available on Pro and Enterprise plans.
        </p>
        <div className="space-y-4">
          <ul className="text-left max-w-md mx-auto space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Real-time performance tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">A/B testing and comparison</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">ROI measurement and attribution</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Export to CSV/PDF</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Custom tracking pixels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Google Analytics integration</span>
            </li>
          </ul>
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}
