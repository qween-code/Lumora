# Lumora - Quick Start Guide

Get Lumora running in **10 minutes**! ⚡

## 🎯 What You'll Build

A fully functional AI content creation platform with:
- ✅ User authentication (email + Google OAuth)
- ✅ AI image generation (FLUX, DALL-E 3, Stable Diffusion)
- ✅ Credit system with automatic deduction
- ✅ Dashboard with generation history
- ✅ Production-ready deployment

---

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- A Supabase account (free)
- A Fal.ai account (pay-as-you-go, ~$5 test budget)

---

## 🚀 Quick Setup (Local Development)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Lumora
npm install
```

### 2. Setup Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor, run `supabase/migrations/001_initial_schema.sql`
3. Get credentials from Settings > API:
   - Project URL
   - anon public key
   - service_role key

### 3. Setup Fal.ai

1. Sign up at [fal.ai](https://fal.ai)
2. Get API key from dashboard
3. Add $5-10 credits

### 4. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FAL_API_KEY=fal_xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run!

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 🧪 Test It

### Step 1: Sign Up
1. Go to http://localhost:3000
2. Click "Start Free"
3. Create account
4. You'll get **100 free credits**!

### Step 2: Generate Your First Image
1. Login to dashboard
2. Go to "Generate > Image"
3. Enter prompt: "A beautiful sunset over mountains, photorealistic, 4K"
4. Select "FLUX Schnell" (2 credits)
5. Click "Generate Image"
6. Wait 5-10 seconds
7. Image appears! 🎉

### Step 3: Check Database
1. Go to Supabase > Table Editor
2. Check `users` table - you're there with 98 credits left
3. Check `generations` table - your image generation record
4. Check `credit_transactions` - credit deduction logged

---

## 📁 Project Structure

```
Lumora/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Sign-in, Sign-up
│   │   ├── dashboard/       # Main app
│   │   │   ├── generate/    # Generation pages
│   │   │   └── page.tsx     # Dashboard home
│   │   ├── api/             # API routes
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   └── dashboard/       # Dashboard components
│   ├── lib/
│   │   ├── ai/              # Fal.ai client
│   │   ├── supabase/        # Supabase clients
│   │   ├── constants.ts     # Tiers, credits, models
│   │   └── utils.ts         # Helper functions
│   └── types/
│       └── database.ts      # TypeScript types
├── supabase/
│   └── migrations/          # Database schema
├── public/                  # Static assets
└── package.json
```

---

## 🎨 Key Features

### 1. Multi-Model AI Generation
- **FLUX Schnell**: Fast, 2 credits
- **FLUX Pro**: Best quality, 5 credits
- **DALL-E 3**: Best text rendering, 4 credits
- **Stable Diffusion 3.5**: Open source, 3 credits

### 2. Credit System
- FREE tier: 100 credits/month (recurring)
- Automatic deduction on generation
- Automatic refund if generation fails
- Transaction history

### 3. Tier System
- **FREE**: 100 credits, 720p, watermarked
- **CREATOR**: $15/mo, 1K credits, 1080p
- **PRO**: $49/mo, 5K credits, 4K, API access
- **ENTERPRISE**: Custom, unlimited

### 4. Database Architecture
- PostgreSQL with Row Level Security (RLS)
- Atomic credit transactions
- Real-time generation status
- Audit trail for all operations

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
# (Run SQL in Supabase dashboard)

# Deployment
vercel                   # Deploy to Vercel
vercel --prod            # Deploy to production
```

---

## 📝 API Examples

### Generate Image

```typescript
const response = await fetch('/api/generate/image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'A beautiful sunset',
    model: 'flux-schnell',
    width: 1024,
    height: 1024,
  }),
});

const data = await response.json();
console.log(data.generation.output_urls); // Array of image URLs
```

### Check Credits

```typescript
const { data: user } = await supabase
  .from('users')
  .select('credits_balance')
  .eq('id', userId)
  .single();

console.log(user.credits_balance); // e.g., 98
```

---

## 🐛 Troubleshooting

### "Insufficient credits"
- Check user credits in Supabase users table
- Manually add credits:
  ```sql
  SELECT add_credits('user-id', 1000, 'bonus', null, 'Test credits');
  ```

### "Unauthorized"
- Check you're logged in
- Clear cookies and re-login
- Check middleware is running

### "Generation failed"
- Check Fal.ai API key is correct
- Check Fal.ai account has credits
- Check console/network tab for errors

### Build fails
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (need 18+)

---

## 🚀 Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full guide.

**Quick deploy:**
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

Your app will be live at `https://your-app.vercel.app`

---

## 📚 Learn More

- **Technical PRD**: [LUMORA_TECHNICAL_PRD.md](./LUMORA_TECHNICAL_PRD.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **README**: [README.md](./README.md)

---

## 💡 Next Steps

1. ✅ Complete local setup
2. ✅ Test image generation
3. Add video generation page (copy image page, modify for video)
4. Add Stripe payment integration
5. Implement analytics
6. Deploy to production
7. Add custom domain
8. Marketing & launch! 🎉

---

## 🤝 Support

- Issues: GitHub Issues
- Docs: See links above
- Community: Discord (coming soon)

---

**Happy building! 🚀**
