# 🔑 KeyFlow - API Key Manager SaaS

> Enterprise-grade API key management with usage tracking, rate limiting, and billing integration. Built for developers who need complete control.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-ORM-brightgreen) ![Clerk](https://img.shields.io/badge/Auth-Clerk-purple)

## 🚀 Features

### Core Features
- ✅ **Secure API Key Generation** - Cryptographically secure keys with bcrypt hashing
- ✅ **Usage Tracking** - Real-time monitoring of API calls, bandwidth, and performance
- ✅ **Rate Limiting** - Flexible per-key rate limits with automatic throttling
- ✅ **Analytics Dashboard** - Beautiful charts and insights into API usage
- ✅ **Project Organization** - Group keys by projects for better management
- ✅ **Authentication** - Powered by Clerk for secure user management
- ✅ **Billing Ready** - Stripe integration for usage-based billing

### Advanced Features
- 🔒 API key expiration dates
- 📊 Daily/hourly usage granularity
- 🚨 Error rate monitoring
- 📝 Detailed API logs
- 🎯 Webhook notifications
- 💳 Subscription management (Free, Pro, Enterprise)

## 💰 Monetization Strategy

### Pricing Tiers
- **Free**: 5 API keys, 10K requests/month, basic analytics
- **Pro ($29/mo)**: Unlimited keys, 1M requests/month, advanced analytics, webhooks
- **Enterprise (Custom)**: Unlimited everything, SLA, white-label, dedicated support

### Revenue Streams
1. Monthly subscriptions
2. Usage-based overage fees
3. White-label licensing
4. API call transaction fees
5. Premium support packages

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Clerk
- **Payments**: Stripe (ready to integrate)
- **Styling**: Tailwind CSS
- **UI Components**: Lucide Icons, React Hot Toast
- **Deployment**: Vercel-ready

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/lokendarjangid/loky_apikey_manager.git
cd loky_apikey_manager

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/apikey_manager"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe (Optional - for billing)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

The app uses PostgreSQL. You can use:
- Local PostgreSQL
- Supabase (free tier)
- Neon (free tier)
- Vercel Postgres

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

## 📖 API Documentation

### Verify API Key

```bash
POST /api/v1/verify
Headers:
  x-api-key: sk_live_abc123...

Response:
{
  "valid": true,
  "keyId": "...",
  "userId": "...",
  "rateLimit": {
    "limit": 1000,
    "remaining": 999,
    "reset": "2024-01-29T12:00:00Z"
  }
}
```

### Create API Key

```bash
POST /api/keys
Headers:
  Authorization: Bearer <clerk_token>
Body:
{
  "name": "Production API",
  "rateLimit": 5000,
  "expiresAt": "2025-12-31"
}

Response:
{
  "apiKey": {
    "id": "...",
    "key": "sk_live_abc123...", // Only shown once!
    "name": "Production API",
    "status": "active"
  }
}
```

### Get API Keys

```bash
GET /api/keys
Headers:
  Authorization: Bearer <clerk_token>

Response:
{
  "keys": [...]
}
```

## 🎨 Features Showcase

### Dashboard
- Overview of all API keys
- Real-time usage statistics
- Quick actions for common tasks
- Activity feed

### API Key Management
- Generate secure keys with one click
- View/hide full keys
- Copy to clipboard
- Set custom rate limits
- Revoke keys instantly

### Analytics
- Daily request volume charts
- Success/error rate tracking
- Top performing keys
- Bandwidth usage monitoring

### Billing (Stripe Ready)
- Subscription management
- Usage-based pricing
- Invoice generation
- Payment history

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lokendarjangid/loky_apikey_manager)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Database Deployment
1. Create a PostgreSQL database (Supabase/Neon/Railway)
2. Copy the connection string
3. Add to Vercel environment variables
4. Run migrations: `npx prisma db push`

## 📈 Scaling Considerations

### Production Enhancements
1. **Redis for Rate Limiting**: Use Upstash Redis for distributed rate limiting
2. **CDN**: Cloudflare for API endpoint caching
3. **Monitoring**: Sentry for error tracking, PostHog for analytics
4. **Queue System**: Bull/BullMQ for async webhook processing
5. **Database Optimization**: Connection pooling, read replicas

## 🔐 Security

- API keys hashed with bcrypt (never stored in plain text)
- Secure random generation using nanoid
- Clerk authentication with middleware protection
- Rate limiting to prevent abuse
- Input validation and sanitization

## 📝 License

MIT License - feel free to use for your own SaaS!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

- Documentation: [Coming soon]
- Issues: GitHub Issues
- Email: support@keyflow.dev (placeholder)

## 🎯 Roadmap

- [ ] Stripe integration for billing
- [ ] Webhook management UI
- [ ] API key rotation
- [ ] Team management
- [ ] Audit logs
- [ ] API playground/testing
- [ ] SDK generation (Python, Node.js, Go)
- [ ] IP whitelisting
- [ ] Custom domains for API endpoints

---

Built with ❤️ by [Lokendar Jangid](https://github.com/lokendarjangid)
