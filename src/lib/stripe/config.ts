import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia" as any,
      typescript: true,
    });
  }
  return _stripe;
}

// Convenience alias - lazily initialized
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

export const STRIPE_PRICES: Record<string, { monthly: string; annual: string }> = {
  CREATOR: {
    monthly: process.env.STRIPE_PRICE_CREATOR_MONTHLY || "",
    annual: process.env.STRIPE_PRICE_CREATOR_ANNUAL || "",
  },
  PRO: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL || "",
  },
};

export function getTierFromPriceId(priceId: string): string | null {
  for (const [tier, prices] of Object.entries(STRIPE_PRICES)) {
    if (prices.monthly === priceId || prices.annual === priceId) {
      return tier;
    }
  }
  return null;
}
