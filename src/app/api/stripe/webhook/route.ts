import { stripe, getTierFromPriceId } from "@/lib/stripe/config";
import { TIER_CREDITS } from "@/lib/constants";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import type { UserTier } from "@/types/database";

// Use service role key for webhook handler (no user session)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.supabase_user_id;
        const targetTier = session.metadata?.target_tier as UserTier;

        if (!userId || !targetTier) break;

        // Update user tier
        await supabase
          .from("users")
          .update({ tier: targetTier })
          .eq("id", userId);

        // Create subscription record
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await supabase.from("subscriptions").upsert({
            user_id: userId,
            tier: targetTier,
            status: "active",
            stripe_subscription_id: subscription.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }, {
            onConflict: "user_id",
          });
        }

        // Grant tier credits
        const credits = TIER_CREDITS[targetTier];
        if (credits > 0) {
          await supabase.rpc("add_credits", {
            p_user_id: userId,
            p_amount: credits,
            p_type: "subscription",
            p_description: `${targetTier} plan activated - ${credits} credits`,
          });
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        const priceId = subscription.items.data[0]?.price?.id;
        const newTier = priceId ? getTierFromPriceId(priceId) : null;

        // Update subscription record
        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status === "active" ? "active" : "past_due",
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            ...(newTier ? { tier: newTier as UserTier } : {}),
          })
          .eq("stripe_subscription_id", subscription.id);

        // Update user tier if changed
        if (newTier) {
          await supabase
            .from("users")
            .update({ tier: newTier as UserTier })
            .eq("id", userId);
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        // Downgrade to FREE
        await supabase
          .from("users")
          .update({ tier: "FREE" })
          .eq("id", userId);

        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        // Find user by stripe customer ID
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (user) {
          await supabase
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("user_id", user.id);
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
