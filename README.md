# Lumora - AI-Powered Content Creation Platform

[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)](https://github.com/your-org/lumora)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red)](./LICENSE)

> **Quick Start:** See [QUICK_START.md](./QUICK_START.md) for 10-minute setup guide
> **Deployment:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
> **PRD:** See [LUMORA_TECHNICAL_PRD.md](./LUMORA_TECHNICAL_PRD.md) for full specifications

## 🚀 Overview

Lumora is a comprehensive AI content creation platform that enables users to generate professional images, videos, and audio using multiple state-of-the-art AI models. Built with a freemium model, attribution analytics, and white-label capabilities.

## ✨ Key Features

- **Multi-Model AI Generation**
  - Images: FLUX, DALL-E 3, Stable Diffusion 3.5
  - Videos: Veo 3, Kling 2.5, WAN 2.5, Sora (coming soon)
  - Audio: ElevenLabs TTS, Stable Audio
  - 3D: Stable Fast 3D

- **Freemium Tiers**
  - FREE: 100 credits/month
  - CREATOR: $15/mo (1,000 credits)
  - PRO: $49/mo (5,000 credits)
  - ENTERPRISE: Custom pricing

- **Unique Differentiators**
  - Attribution Analytics (ROI tracking, A/B testing)
  - White-Label Platform (Enterprise)
  - One-Click Tier Switching
  - Template Marketplace

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **UI**: shadcn/ui components
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **AI**: Fal.ai (primary), Replicate, OpenAI, Stability AI
- **Storage**: Cloudflare R2
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/lumora.git
cd lumora
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in the required environment variables:
- Supabase credentials
- Stripe API keys
- Fal.ai API key
- Other AI provider keys

4. Set up Supabase:
- Create a new Supabase project
- Run the migration in `supabase/migrations/001_initial_schema.sql`
- Copy your Supabase URL and anon key to `.env.local`

5. Set up Stripe:
- Create products and prices in Stripe dashboard
- Copy price IDs to `.env.local`
- Set up webhook endpoint

6. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
lumora/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (dashboard)/    # Dashboard pages
│   │   ├── api/            # API routes
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── ...            # Custom components
│   ├── lib/               # Utility functions
│   │   ├── supabase/      # Supabase clients
│   │   ├── stripe/        # Stripe utilities
│   │   ├── ai/            # AI service integrations
│   │   └── utils.ts       # Common utilities
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   └── styles/            # Global styles
├── supabase/
│   └── migrations/        # Database migrations
├── public/                # Static assets
└── ...config files
```

## 🔑 Environment Variables

See `.env.example` for all required environment variables.

## 🗄️ Database Schema

The database schema includes:
- `users`: User profiles and credits
- `subscriptions`: Stripe subscription data
- `credit_transactions`: Credit usage history
- `generations`: AI generation records
- `workspaces`: Team workspaces
- `templates`: Generation templates
- `analytics_events`: Analytics tracking

See `supabase/migrations/001_initial_schema.sql` for full schema.

## 💳 Credit System

- Each generation costs credits based on model and parameters
- Credits are deducted atomically using PostgreSQL functions
- Free tier: 100 credits/month (recurring)
- Paid tiers: Monthly credit allowances

## 🎨 UI Components

Built with shadcn/ui for consistent, accessible components:
- Button, Input, Select, Dialog, etc.
- Custom theme with primary purple branding
- Dark mode support

## 📊 Analytics

Track generation performance:
- Views, clicks, conversions
- A/B testing
- ROI measurement
- Export to CSV/PDF

## 🔐 Security

- Row Level Security (RLS) on all tables
- Secure API routes with authentication
- Rate limiting by tier
- Stripe webhook verification
- Environment variable validation

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Docker (Alternative)

```bash
docker build -t lumora .
docker run -p 3000:3000 lumora
```

## 📝 License

Proprietary - All rights reserved

## 🤝 Contributing

This is a private project. Contributions are by invitation only.

## 📞 Support

For enterprise inquiries: enterprise@lumora.ai
For support: support@lumora.ai

---

Built with ❤️ by the Lumora team
