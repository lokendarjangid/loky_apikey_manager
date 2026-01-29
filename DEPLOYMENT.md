# 🚀 Deployment Guide - KeyFlow API Key Manager

## Quick Deploy to Vercel

### 1. Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Clerk account (for auth)
- PostgreSQL database (Supabase/Neon/Railway - all have free tiers)

### 2. Database Setup

#### Option A: Supabase (Recommended for beginners)
1. Go to supabase.com and create a new project
2. Wait for database to provision (~2 minutes)
3. Go to Project Settings → Database
4. Copy the "Connection String" (Pooler mode recommended)
5. Replace `[YOUR-PASSWORD]` in the string with your actual password

#### Option B: Neon (Serverless PostgreSQL)
1. Go to neon.tech and create a new project
2. Copy the connection string from the dashboard
3. Already formatted for Prisma!

#### Option C: Railway
1. Go to railway.app and create a new PostgreSQL database
2. Copy the connection string from the "Connect" tab

### 3. Clerk Setup (Authentication)

1. Go to clerk.com and sign up
2. Create a new application
3. Choose "Next.js" as the framework
4. Copy these values:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
5. In Clerk dashboard:
   - Go to "Paths" settings
   - Set Sign in URL: `/sign-in`
   - Set Sign up URL: `/sign-up`
   - Set After sign in: `/dashboard`
   - Set After sign up: `/dashboard`

### 4. Deploy to Vercel

#### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lokendarjangid/loky_apikey_manager)

#### Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd loky_apikey_manager
vercel
```

### 5. Set Environment Variables in Vercel

Go to your project → Settings → Environment Variables and add:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# App (will be your Vercel domain)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Generate a random secret for API key hashing
API_SECRET_KEY=generate_a_random_string_here
```

**To generate `API_SECRET_KEY`:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use any random string generator
```

### 6. Deploy Database Schema

After setting environment variables:

```bash
# Option A: From your local machine
DATABASE_URL="your_connection_string" npx prisma db push

# Option B: Use Vercel CLI
vercel env pull .env.local
npx prisma db push
```

### 7. Redeploy

After setting up the database:
```bash
# Trigger a redeploy
vercel --prod
```

Or in Vercel dashboard: Deployments → Redeploy

### 8. Test Your Deployment

1. Visit your Vercel URL
2. Click "Sign Up" and create an account
3. You should be redirected to `/dashboard`
4. Create your first API key!

## Optional: Stripe Integration (for Billing)

### 1. Stripe Setup
1. Go to stripe.com and create an account
2. Get your API keys from Dashboard → Developers → API keys
3. Add to Vercel environment variables:
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. Create Products in Stripe
- Free Plan: $0
- Pro Plan: $29/month
- Enterprise: Custom pricing

### 3. Set up Webhooks
1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
4. Copy the webhook signing secret
5. Add to Vercel:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Production Optimizations

### 1. Redis for Rate Limiting (Optional but Recommended)

#### Upstash Redis (Free tier available)
1. Go to upstash.com
2. Create a Redis database
3. Copy REST URL and token
4. Add to Vercel:
```env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### 2. Custom Domain
1. In Vercel: Settings → Domains
2. Add your custom domain
3. Update environment variables:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Monitoring
- Enable Vercel Analytics
- Add Sentry for error tracking
- Use PostHog for product analytics

## Troubleshooting

### Database Connection Issues
```bash
# Test connection locally
npx prisma db push

# View data
npx prisma studio
```

### Clerk Auth Issues
- Make sure redirect URLs match exactly
- Check that environment variables are set
- Clear cookies and try again

### Build Failures
```bash
# Common fixes:
npm install
npx prisma generate
npm run build
```

### Can't see API keys
- Check browser console for errors
- Verify DATABASE_URL is correct
- Make sure Prisma schema was pushed: `npx prisma db push`

## Support

- GitHub Issues: https://github.com/lokendarjangid/loky_apikey_manager/issues
- Vercel Docs: https://vercel.com/docs
- Clerk Docs: https://clerk.com/docs
- Prisma Docs: https://www.prisma.io/docs

## Cost Estimate

### Free Tier (Perfect for testing/small projects)
- Vercel: Free (hobby plan)
- Database: Free tier on Supabase/Neon
- Clerk: Free up to 10,000 MAU
- Stripe: Pay only when you make money (no monthly fee)

**Total: $0/month** until you scale!

### Growing Project (~1000 users)
- Vercel Pro: $20/month
- Database: $10-25/month
- Clerk: $25/month
- Upstash Redis: $10/month

**Total: ~$65-80/month**

Ready to make money! 🚀
