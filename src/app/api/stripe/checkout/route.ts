import { createClient } from "@/lib/supabase/server";
import { stripe, STRIPE_PRICES } from "@/lib/stripe/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier, billingCycle } = await request.json();

    if (!tier || !billingCycle || !STRIPE_PRICES[tier]) {
      return NextResponse.json({ error: "Invalid tier or billing cycle" }, { status: 400 });
    }

    const priceId = STRIPE_PRICES[tier][billingCycle as "monthly" | "annual"];
    if (!priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 400 });
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("users")
      .select("stripe_customer_id, email, name")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.name || undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Create Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?upgrade=success&tier=${tier}`,
      cancel_url: `${appUrl}/dashboard/pricing`,
      metadata: {
        supabase_user_id: user.id,
        target_tier: tier,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          tier,
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
