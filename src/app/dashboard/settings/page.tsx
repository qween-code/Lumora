"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { User, CreditCard, Key, Bell, Shield, ExternalLink, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Update failed");
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Could not update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to open billing portal");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Billing portal unavailable",
        description: error.message || "Could not open billing portal",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="rounded-lg border bg-card p-6 space-y-6">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                type="url"
                placeholder="https://..."
              />
            </div>

            <Button onClick={handleUpdateProfile} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>

        {/* Subscription & Billing */}
        <div className="rounded-lg border bg-card p-6 space-y-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Subscription & Billing</h2>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Current Plan</p>
                <p className="text-sm text-muted-foreground">FREE</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/pricing">Upgrade</a>
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Credits Remaining</p>
                <p className="text-sm text-muted-foreground">100 / 100</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/pricing">Buy Credits</a>
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Manage Subscription</Label>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleManageBilling}
                disabled={portalLoading}
              >
                {portalLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Opening portal...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Billing Portal
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Update payment method, view invoices, or cancel subscription
              </p>
            </div>
          </div>
        </div>

        {/* API Keys (Pro+) */}
        <div className="rounded-lg border bg-card p-6 space-y-6 opacity-50">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">API Keys</h2>
            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              PRO
            </span>
          </div>

          <Separator />

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              API access is available on Pro and Enterprise plans.
            </p>
            <Button disabled variant="outline">
              Generate API Key
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border bg-card p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your account
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Generation Complete</p>
                <p className="text-sm text-muted-foreground">
                  Notify when AI generation is complete
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Credits Warning</p>
                <p className="text-sm text-muted-foreground">
                  Alert when credits are running low
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-lg border bg-card p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Change Password</Label>
              <Button variant="outline" className="w-full justify-start">
                Update Password
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <Button variant="outline" className="w-full justify-start">
                Enable 2FA
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Active Sessions</Label>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Current session</p>
                <p className="text-xs text-muted-foreground">Last active: Just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-lg border border-destructive bg-card p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Irreversible actions that affect your account
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
