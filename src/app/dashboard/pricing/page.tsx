"use client";

import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown, Building2 } from "lucide-react";
import { TIER_CREDITS, TIER_PRICES } from "@/lib/constants";
import Link from "next/link";

const tiers = [
  {
    name: "FREE",
    icon: Sparkles,
    price: 0,
    credits: TIER_CREDITS.FREE,
    features: [
      "100 credits per month",
      "720p resolution",
      "Watermarked outputs",
      "Personal use only",
      "Community support",
      "Basic templates",
    ],
    limitations: [
      "No commercial use",
      "5 second videos max",
      "Single user",
    ],
    cta: "Current Plan",
    current: true,
  },
  {
    name: "CREATOR",
    icon: Zap,
    price: TIER_PRICES.CREATOR.monthly,
    annualPrice: TIER_PRICES.CREATOR.annual,
    credits: TIER_CREDITS.CREATOR,
    popular: true,
    features: [
      "1,000 credits per month",
      "1080p resolution",
      "No watermarks",
      "Commercial use allowed",
      "Email support (48h)",
      "All templates",
      "10 second videos",
      "Download in multiple formats",
    ],
    cta: "Upgrade to Creator",
    upgrade: true,
  },
  {
    name: "PRO",
    icon: Crown,
    price: TIER_PRICES.PRO.monthly,
    annualPrice: TIER_PRICES.PRO.annual,
    credits: TIER_CREDITS.PRO,
    features: [
      "5,000 credits per month",
      "4K resolution",
      "No watermarks",
      "Commercial use + resale rights",
      "Priority support (24h)",
      "All templates + custom templates",
      "30 second videos",
      "API access",
      "Team collaboration (5 members)",
      "Advanced analytics",
      "A/B testing",
      "Priority generation queue",
    ],
    cta: "Upgrade to Pro",
    upgrade: true,
  },
  {
    name: "ENTERPRISE",
    icon: Building2,
    price: "Custom",
    credits: "Unlimited",
    features: [
      "Unlimited credits",
      "4K+ resolution",
      "White-label platform",
      "Dedicated support (2h SLA)",
      "Custom model training",
      "SSO/SAML authentication",
      "Unlimited team members",
      "60+ second videos",
      "Full API access",
      "Custom integrations",
      "SLA guarantees (99.9%)",
      "Dedicated account manager",
      "Volume discounts",
    ],
    cta: "Contact Sales",
    enterprise: true,
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Start free, upgrade as you grow
        </p>
      </div>

      {/* Annual Discount Banner */}
      <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-center">
        <p className="text-sm font-medium">
          💰 Save 20% with annual billing on Creator and Pro plans
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 lg:grid-cols-4">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.name}
              className={`relative rounded-lg border p-6 ${
                tier.popular
                  ? "border-primary shadow-lg scale-105"
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    {typeof tier.price === "number" ? (
                      <>
                        <span className="text-3xl font-bold">${tier.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">{tier.price}</span>
                    )}
                  </div>
                  {tier.annualPrice && (
                    <p className="text-sm text-muted-foreground">
                      or ${tier.annualPrice}/mo billed annually
                    </p>
                  )}
                  <p className="text-sm font-medium text-primary">
                    {tier.credits === "Unlimited" ? "Unlimited" : `${tier.credits.toLocaleString()}`} credits/month
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Limitations */}
                {tier.limitations && (
                  <ul className="space-y-2 pt-4 border-t">
                    {tier.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="shrink-0">•</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA */}
                <div className="pt-4">
                  {tier.current ? (
                    <Button className="w-full" variant="outline" disabled>
                      {tier.cta}
                    </Button>
                  ) : tier.enterprise ? (
                    <Link href="/contact" className="block">
                      <Button className="w-full">
                        {tier.cta}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                    >
                      {tier.cta}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-center">Detailed Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Feature</th>
                <th className="text-center p-4">FREE</th>
                <th className="text-center p-4">CREATOR</th>
                <th className="text-center p-4">PRO</th>
                <th className="text-center p-4">ENTERPRISE</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">{feature.name}</td>
                  <td className="p-4 text-center">{feature.free}</td>
                  <td className="p-4 text-center">{feature.creator}</td>
                  <td className="p-4 text-center">{feature.pro}</td>
                  <td className="p-4 text-center">{feature.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg border p-6">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const comparisonFeatures = [
  { name: "Monthly Credits", free: "100", creator: "1,000", pro: "5,000", enterprise: "Unlimited" },
  { name: "Max Resolution", free: "720p", creator: "1080p", pro: "4K", enterprise: "4K+" },
  { name: "Video Duration", free: "5s", creator: "10s", pro: "30s", enterprise: "60s+" },
  { name: "Watermark", free: "Yes", creator: "No", pro: "No", enterprise: "No" },
  { name: "Commercial Use", free: "No", creator: "Yes", pro: "Yes", enterprise: "Yes" },
  { name: "Team Members", free: "1", creator: "1", pro: "5", enterprise: "Unlimited" },
  { name: "API Access", free: "No", creator: "No", pro: "Yes", enterprise: "Full" },
  { name: "Analytics", free: "No", creator: "Basic", pro: "Advanced", enterprise: "Enterprise" },
  { name: "Support", free: "Community", creator: "Email (48h)", pro: "Priority (24h)", enterprise: "Dedicated (2h)" },
  { name: "White-Label", free: "No", creator: "No", pro: "No", enterprise: "Yes" },
];

const faqs = [
  {
    question: "Can I change plans anytime?",
    answer: "Yes! You can upgrade instantly or downgrade at the end of your billing cycle. Unused credits don't roll over.",
  },
  {
    question: "What happens if I run out of credits?",
    answer: "You can purchase additional credit packs or upgrade to a higher tier. Generation will pause until you add more credits.",
  },
  {
    question: "Do credits expire?",
    answer: "Free tier credits reset monthly. Paid tier credits expire at the end of each billing cycle.",
  },
  {
    question: "Can I get a refund?",
    answer: "We offer refunds within 7 days of purchase if you haven't used more than 10% of your credits.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and PayPal via Stripe.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "New users get 100 free credits to test the platform. No credit card required for the free tier.",
  },
];
