# Lumora Deployment Guide

## 🚀 Quick Deployment to Production

### Prerequisites

1. **Supabase Account** (free tier available)
   - Sign up at [supabase.com](https://supabase.com)

2. **Fal.ai API Key** (pay-as-you-go)
   - Sign up at [fal.ai](https://fal.ai)
   - Get API key from dashboard

3. **Stripe Account** (optional for payments)
   - Sign up at [stripe.com](https://stripe.com)

4. **Vercel Account** (free tier available)
   - Sign up at [vercel.com](https://vercel.com)

---

## Step 1: Setup Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - Name: `lumora`
   - Database Password: (save this!)
   - Region: Closest to your users
4. Wait for project creation (~2 minutes)

### 1.2 Run Database Migration

1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy-paste contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"
5. Verify tables created: users, subscriptions, generations, etc.

### 1.3 Enable Authentication

1. Go to Authentication > Providers
2. Enable:
   - **Email** (already enabled by default)
   - **Google OAuth** (optional):
     - Get OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
     - Add authorized redirect URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - Enter Client ID and Client Secret

### 1.4 Get Supabase Credentials

1. Go to Settings > API
2. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

---

## Step 2: Setup Fal.ai

1. Sign up at [fal.ai](https://fal.ai)
2. Go to [dashboard](https://fal.ai/dashboard/keys)
3. Click "Create new key"
4. Copy API key (starts with `fal_...`)
5. Add credits to your account (pay-as-you-go)

---

## Step 3: Deploy to Vercel

### 3.1 Fork/Clone Repository

```bash
git clone https://github.com/your-org/Lumora.git
cd Lumora
```

### 3.2 Push to GitHub

```bash
git remote add origin https://github.com/your-username/lumora.git
git push -u origin main
```

### 3.3 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3.4 Add Environment Variables

In Vercel project settings > Environment Variables, add:

```bash
# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME=Lumora

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Fal.ai
FAL_API_KEY=fal_xxxxxxxxxxxxxxxxxx

# Stripe (optional - for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Stripe Price IDs (create these in Stripe dashboard)
STRIPE_PRICE_CREATOR_MONTHLY=price_xxxxx
STRIPE_PRICE_CREATOR_ANNUAL=price_xxxxx
STRIPE_PRICE_PRO_MONTHLY=price_xxxxx
STRIPE_PRICE_PRO_ANNUAL=price_xxxxx
```

### 3.5 Deploy

1. Click "Deploy"
2. Wait for build (~2-5 minutes)
3. Visit your live site! 🎉

---

## Step 4: Post-Deployment Configuration

### 4.1 Update Supabase Redirect URLs

1. Go to Supabase > Authentication > URL Configuration
2. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**:
     - `https://your-app.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for local dev)

### 4.2 Setup Stripe Webhook (if using payments)

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy webhook signing secret
6. Add to Vercel env vars as `STRIPE_WEBHOOK_SECRET`

### 4.3 Create Stripe Products (if using payments)

1. Go to Stripe Dashboard > Products
2. Create products:

   **CREATOR Plan:**
   - Name: Lumora Creator
   - Price: $15/month (recurring)
   - Price: $144/year (recurring, $12/month)
   - Copy price IDs to env vars

   **PRO Plan:**
   - Name: Lumora Pro
   - Price: $49/month (recurring)
   - Price: $468/year (recurring, $39/month)
   - Copy price IDs to env vars

3. Redeploy Vercel after adding price IDs

---

## Step 5: Test Your Deployment

### 5.1 Create Test Account

1. Visit `https://your-app.vercel.app`
2. Click "Sign up"
3. Create account with your email
4. Check email for verification (if enabled)

### 5.2 Test Image Generation

1. Login to dashboard
2. Go to Generate > Image
3. Enter prompt: "A beautiful sunset over mountains"
4. Select model: FLUX Schnell
5. Click "Generate Image"
6. Verify image appears and credits deducted

### 5.3 Check Database

1. Go to Supabase > Table Editor
2. Check `users` table - your account should be there with 100 credits
3. Check `credit_transactions` - should show welcome bonus
4. Check `generations` - should show your image generation

---

## Local Development

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your credentials to .env.local

# Run database migrations
# (Copy SQL from supabase/migrations/001_initial_schema.sql to Supabase SQL editor)

# Start development server
npm run dev
```

### Visit

- App: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

---

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Check all required env vars are set in Vercel
- Redeploy after adding env vars

**Error: Cannot connect to Supabase**
- Verify Supabase URL and keys are correct
- Check Supabase project is running (not paused)

### Authentication Issues

**OAuth not working**
- Check redirect URLs match in Supabase and OAuth provider
- Verify OAuth credentials are correct

**Email verification not sending**
- Check Supabase > Authentication > Email Templates
- Configure custom SMTP (optional)

### Generation Fails

**Insufficient credits**
- Check user credits_balance in database
- Manually add credits via Supabase SQL:
  ```sql
  SELECT add_credits('user-id-here', 1000, 'bonus', null, 'Manual credit top-up');
  ```

**Fal.ai API error**
- Verify FAL_API_KEY is correct
- Check Fal.ai account has credits
- Check API key permissions

---

## Scaling Considerations

### Database

- **Free tier**: 500MB, 2GB bandwidth, 50K monthly active users
- **Pro tier**: Unlimited, $25/month
- Enable connection pooling for high traffic

### Fal.ai Costs

- FLUX Schnell: ~$0.003/image
- FLUX Pro: ~$0.05/image
- Kling Video 5s: ~$0.08/video
- Monitor usage in Fal.ai dashboard

### Vercel

- **Hobby tier**: Free, 100GB bandwidth
- **Pro tier**: $20/month, 1TB bandwidth
- **Enterprise**: Custom pricing

---

## Monitoring

### Sentry (Error Tracking)

1. Sign up at [sentry.io](https://sentry.io)
2. Create Next.js project
3. Add to env vars:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
   ```
4. Install Sentry SDK:
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

### Analytics

Consider adding:
- PostHog (product analytics)
- Mixpanel (user behavior)
- Google Analytics (traffic)

---

## Security Checklist

- [ ] Environment variables secured (not in code)
- [ ] Supabase RLS policies enabled
- [ ] API routes authenticate users
- [ ] Rate limiting implemented (Vercel edge config)
- [ ] Stripe webhooks verified
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Input validation on all forms

---

## Production Checklist

- [ ] Database migration run successfully
- [ ] All environment variables set
- [ ] Authentication working (email + OAuth)
- [ ] Image generation working
- [ ] Credit system working (deduction + refund)
- [ ] Stripe payments working (if enabled)
- [ ] Error tracking setup (Sentry)
- [ ] Monitoring setup
- [ ] Domain configured (optional)
- [ ] SSL certificate (automatic with Vercel)
- [ ] Backup strategy (Supabase auto-backup enabled)

---

## Support

- **GitHub Issues**: https://github.com/your-org/lumora/issues
- **Email**: support@lumora.ai
- **Supabase Docs**: https://supabase.com/docs
- **Fal.ai Docs**: https://fal.ai/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Congratulations! Your Lumora instance is now live! 🎉**
