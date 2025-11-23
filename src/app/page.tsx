import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield, Palette } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-text">Lumora</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/templates" className="text-sm font-medium hover:text-primary transition-colors">
              Templates
            </Link>
            <Link href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
              Docs
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container flex flex-col items-center justify-center gap-8 py-24 md:py-32">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span>AI-Powered Content Creation Platform</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Create Stunning
              <br />
              <span className="gradient-text">AI Content</span>
              <br />
              in Seconds
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              Generate professional images, videos, and audio with multiple AI models.
              Track ROI with built-in analytics. Start free, upgrade as you grow.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-base">
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="text-base">
                Watch Demo
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>100 Free Credits</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <span>10+ AI Models</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t bg-muted/50">
        <div className="container py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
              Professional AI tools, analytics, and collaboration - all in one platform
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col gap-4 rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container py-24">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Create?
            </h2>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              Join thousands of creators using Lumora to generate stunning AI content
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="text-base">
                Start Free - 100 Credits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">Lumora</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Lumora. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    title: "Multi-Model AI",
    description: "Access 10+ best-in-class AI models for images, videos, and audio generation.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate content in seconds with optimized inference infrastructure.",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "SOC 2 compliant, white-label options, and dedicated support.",
  },
];
