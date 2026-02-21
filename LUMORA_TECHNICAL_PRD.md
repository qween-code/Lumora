# LUMORA - TECHNICAL PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Version:** 2.0
**Date:** February 2026
**Status:** Active Development
**Stack:** Next.js 15 + Supabase + Fal.ai + Stripe

---

## 1. EXECUTIVE SUMMARY

### Vision
Lumora is a unified multimodal AI content generation SaaS platform. It aggregates best-in-class AI models (FLUX, Kling, Veo, Stable Audio, ElevenLabs) behind a single interface with a credit-based freemium billing model.

### Market Positioning
| Gap | Lumora's Answer |
|---|---|
| No single platform does image + video + audio + 3D | Multi-model aggregator with unified credits |
| Attribution analytics missing | Built-in ROI tracking per asset |
| White-label options rare | Enterprise white-label offering |
| Complex onboarding | Free tier, zero config, one-click generate |

### Target Segments
- **Creators** - YouTubers, TikTokers, podcasters needing quick visual/audio assets
- **SMBs** - E-commerce, real estate, food brands needing product imagery and ads
- **Agencies** - Marketing teams needing volume content with analytics
- **Enterprise** - Companies needing white-label, SSO, custom model training

---

## 2. ARCHITECTURE

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, shadcn/ui (Radix primitives) |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase PostgreSQL with RLS |
| AI Inference | Fal.ai (primary), multi-provider model registry |
| Payments | Stripe (Checkout, Webhooks, Customer Portal) |
| State | React Query (server), Zustand (client) |
| Validation | Zod |

### Directory Structure

```
src/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout + providers
│   ├── (auth)/                       # Sign in / Sign up
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── auth/callback/route.ts        # OAuth callback
│   ├── api/
│   │   ├── generate/
│   │   │   ├── image/route.ts        # POST - image generation
│   │   │   ├── video/route.ts        # POST - video generation
│   │   │   └── audio/route.ts        # POST - audio generation
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts     # POST - create checkout session
│   │   │   ├── webhook/route.ts      # POST - handle Stripe events
│   │   │   └── portal/route.ts       # POST - billing portal session
│   │   └── user/
│   │       └── profile/route.ts      # GET/PATCH - user profile
│   └── dashboard/
│       ├── page.tsx                  # Dashboard home
│       ├── layout.tsx                # Dashboard layout (header + sidebar)
│       ├── generate/
│       │   ├── image/page.tsx
│       │   ├── video/page.tsx
│       │   └── audio/page.tsx
│       ├── history/page.tsx          # Generation history grid
│       ├── templates/page.tsx        # Template marketplace
│       ├── analytics/page.tsx        # Analytics (Pro+)
│       ├── pricing/page.tsx          # Pricing + Stripe checkout
│       └── settings/page.tsx         # Profile, billing, security
├── components/
│   ├── dashboard/
│   │   ├── dashboard-header.tsx
│   │   └── dashboard-nav.tsx
│   └── ui/                          # shadcn/ui components
├── lib/
│   ├── ai/
│   │   ├── fal-client.ts            # Fal.ai SDK wrapper
│   │   ├── model-registry.ts        # Centralized model config
│   │   └── generate.ts              # Unified generation engine
│   ├── stripe/
│   │   └── config.ts                # Stripe client + price mappings
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   └── server.ts                # Server client (cookies)
│   ├── constants.ts                  # Credits, tiers, limits
│   └── utils.ts                     # Helpers (cn, formatters)
├── hooks/
│   └── use-toast.ts
├── types/
│   └── database.ts                   # Full Supabase type definitions
└── middleware.ts                     # Auth route protection
```

### Database Schema

8 tables with Row Level Security:

| Table | Purpose |
|---|---|
| `users` | Profile, tier, credits_balance, stripe_customer_id |
| `subscriptions` | Stripe subscription tracking |
| `credit_transactions` | Atomic credit ledger (deduct/add/refund) |
| `generations` | All AI generation records with status tracking |
| `templates` | Pre-built and community templates |
| `workspaces` | Team collaboration (Pro+) |
| `workspace_members` | Workspace membership with roles |
| `analytics_events` | Attribution tracking events |

Key database functions:
- `deduct_credits(user_id, amount, type, reference_id, description)` - Atomic credit deduction
- `add_credits(user_id, amount, type, description)` - Credit addition (subscription, refund, bonus)
- `handle_new_user()` - Trigger on auth.users insert → creates profile with 100 free credits

---

## 3. AI MODEL REGISTRY

Centralized in `src/lib/ai/model-registry.ts`. Each model defines:
- Fal.ai endpoint
- Credit cost
- Input builder function
- Output extractor function
- Minimum tier requirement

### Image Models

| Model | Provider | Credits | Min Tier |
|---|---|---|---|
| FLUX.1 Schnell | fal-ai | 2 | FREE |
| FLUX.1 Pro | fal-ai | 5 | FREE |
| Hunyuan Image 3 | fal-ai | 3 | FREE |

### Video Models

| Model | Provider | Credits (5s/10s) | Min Tier |
|---|---|---|---|
| Kling 2.5 Turbo | fal-ai | 8/16 | FREE |
| Veo 3 | fal-ai | 12/24 | CREATOR |
| WAN 2.5 | fal-ai | 20/40 | CREATOR |

### Audio Models

| Model | Provider | Credits | Min Tier |
|---|---|---|---|
| Stable Audio | fal-ai | 10 | FREE |
| ElevenLabs TTS | fal-ai | 5 | FREE |

### Unified Generation Flow

```
Client Request
    ↓
API Route (thin: auth + parse + respond)
    ↓
executeGeneration() ← Unified engine
    ├── getModelConfig(modelId) ← Registry lookup
    ├── getModelCredits(modelId, params) ← Cost calculation
    ├── Check credits_balance
    ├── INSERT generations (status: pending)
    ├── deduct_credits RPC (atomic)
    ├── UPDATE generations (status: processing)
    ├── modelConfig.buildInput(params) ← Model-specific
    ├── generateWithFal(endpoint, input) ← Fal.ai call
    ├── modelConfig.extractOutput(result) ← Model-specific
    ├── UPDATE generations (status: completed)
    └── On failure: UPDATE (status: failed) + add_credits (refund)
```

---

## 4. FREEMIUM & MONETIZATION

### Tier Structure

| Feature | FREE | CREATOR ($15/mo) | PRO ($49/mo) | ENTERPRISE |
|---|---|---|---|---|
| Credits/month | 100 | 1,000 | 5,000 | Unlimited |
| Max Resolution | 720p | 1080p | 4K | 4K+ |
| Video Duration | 5s | 10s | 30s | 60s+ |
| Watermark | Yes | No | No | No |
| Commercial Use | No | Yes | Yes | Yes |
| Team Members | 1 | 1 | 5 | Unlimited |
| API Access | No | No | Yes | Full |
| Analytics | No | Basic | Advanced | Enterprise |
| Support | Community | Email (48h) | Priority (24h) | Dedicated (2h SLA) |
| White-Label | No | No | No | Yes |
| Concurrent Jobs | 1 | 2 | 5 | 20 |

### Annual Billing
- CREATOR: $12/mo billed annually (20% discount)
- PRO: $39/mo billed annually (20% discount)

### Stripe Integration

**Checkout Flow:**
1. User clicks "Upgrade" on pricing page
2. `POST /api/stripe/checkout` creates Stripe Checkout Session
3. User redirected to Stripe-hosted checkout
4. On completion, webhook `checkout.session.completed` fires
5. Webhook handler: updates user tier + creates subscription + grants credits

**Webhook Events Handled:**
- `checkout.session.completed` → Activate subscription + grant credits
- `customer.subscription.updated` → Sync tier/status changes
- `customer.subscription.deleted` → Downgrade to FREE
- `invoice.payment_failed` → Mark subscription as past_due

**Customer Portal:**
- `POST /api/stripe/portal` → Stripe Billing Portal for self-service management

---

## 5. CORE FEATURES

### 5.1 Image Generation
- Multi-model selection (FLUX Schnell, FLUX Pro, Hunyuan)
- Configurable resolution (width/height)
- Multi-image generation (num_images)
- Real-time cost display
- Download with one click
- Automatic credit refund on failure

### 5.2 Video Generation
- Multi-model selection (Kling 2.5, Veo 3, WAN 2.5)
- Duration selection (5s/10s)
- Aspect ratio (16:9, 9:16, 1:1)
- Hover-to-preview in history
- Download as MP4

### 5.3 Audio Generation
- Text-to-Speech (ElevenLabs) with voice selection
- Music/Sound Effects (Stable Audio) with duration control
- Inline audio player preview
- Download as MP3/WAV

### 5.4 Template Marketplace
- 12 pre-built templates across categories
- Category filtering (e-commerce, social-media, real-estate, fashion, food, travel, education, marketing, gaming)
- Type filtering (image, video, audio)
- Search functionality
- One-click generation from template
- Usage counter per template

### 5.5 Generation History
- Grid view with thumbnails
- Type filtering (all, images, videos, audio, 3D)
- Status badges (pending, processing, completed, failed)
- Hover-to-play for videos
- Download button overlay
- Prompt display and metadata

### 5.6 Analytics (Pro+)
- Total generations counter
- Total views tracking
- Click-through rate
- ROI measurement
- Pro feature upsell for free users

### 5.7 Settings
- Profile management (name, email, avatar)
- Subscription & billing (current plan, credits, Stripe portal)
- API Keys (Pro+)
- Notifications (email, generation complete, low credits)
- Security (password, 2FA, sessions)
- Danger zone (account deletion)

---

## 6. AUTHENTICATION & SECURITY

### Auth Flow
- Supabase Auth with email/password + Google OAuth
- Server-side session validation via `createServerClient`
- Middleware route protection for `/dashboard/*`
- Auto-redirect authenticated users from auth pages

### Security Measures
- Row Level Security on all tables (users can only access own data)
- Service role key isolated to webhook handler only
- Stripe webhook signature verification
- Atomic credit transactions (PostgreSQL functions prevent race conditions)
- No client-side secrets exposure

---

## 7. DEPLOYMENT & CONFIGURATION

### Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Fal.ai
FAL_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_CREATOR_MONTHLY=
STRIPE_PRICE_CREATOR_ANNUAL=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_ANNUAL=

# App
NEXT_PUBLIC_APP_URL=
```

### Deployment Steps
1. Deploy database migrations (`supabase/migrations/001_initial_schema.sql`)
2. Configure Supabase Auth providers (email + Google)
3. Create Stripe products/prices and set env vars
4. Configure Stripe webhook endpoint → `{APP_URL}/api/stripe/webhook`
5. Deploy to Vercel with env vars
6. Set `NEXT_PUBLIC_APP_URL` to production domain

---

## 8. ROADMAP

### Phase 1 - MVP (Current)
- [x] Landing page + auth flow
- [x] Dashboard with credit system
- [x] Image generation (FLUX Schnell/Pro)
- [x] Video generation (Kling, Veo)
- [x] Audio generation (Stable Audio, ElevenLabs TTS)
- [x] Template marketplace (12 templates)
- [x] Generation history with filters
- [x] Stripe checkout + webhooks + portal
- [x] Pricing page with billing toggle
- [x] Settings (profile, billing, notifications, security)
- [x] Centralized AI model registry
- [x] Unified generation engine

### Phase 2 - Growth
- [ ] 3D generation (Stable Fast 3D)
- [ ] Image-to-video generation
- [ ] Workspace/team collaboration
- [ ] Advanced analytics dashboard
- [ ] API key generation and management
- [ ] Custom template creation
- [ ] Generation queue with progress tracking
- [ ] Batch generation

### Phase 3 - Enterprise
- [ ] White-label platform
- [ ] SSO/SAML authentication
- [ ] Custom model training
- [ ] Advanced API with rate limiting
- [ ] Webhook notifications
- [ ] SLA monitoring
- [ ] Admin dashboard
- [ ] Usage-based billing option

---

## 9. CREDIT COST TABLE

| Generation Type | Model | Config | Credits |
|---|---|---|---|
| Image | FLUX Schnell | per image | 2 |
| Image | FLUX Pro | per image | 5 |
| Image | Hunyuan Image 3 | per image | 3 |
| Video | Kling 2.5 Turbo | 5s | 8 |
| Video | Kling 2.5 Turbo | 10s | 16 |
| Video | Veo 3 | 5s | 12 |
| Video | Veo 3 | 10s | 24 |
| Video | WAN 2.5 | 5s | 20 |
| Video | WAN 2.5 | 10s | 40 |
| Audio | Stable Audio | per generation | 10 |
| Audio | ElevenLabs TTS | per generation | 5 |

---

## 10. KEY DESIGN DECISIONS

1. **Fal.ai as primary provider** - Single SDK, consistent API, broad model support. Additional providers can be added to model registry without changing generation engine.

2. **Atomic credit system** - PostgreSQL functions (`deduct_credits`, `add_credits`) ensure no race conditions. Automatic refund on generation failure.

3. **Centralized model registry** - Adding a new AI model requires only adding an entry to `MODEL_REGISTRY`. No changes to API routes or UI needed.

4. **Thin API routes** - Each route handles only auth + parsing + response formatting. All business logic lives in `executeGeneration()`.

5. **Stripe webhook-driven billing** - Server-authoritative subscription state. Client never manages payment state directly.

6. **Supabase RLS** - Database-level security. Even if API routes have bugs, users cannot access other users' data.
