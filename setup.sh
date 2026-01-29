#!/bin/bash

echo "🔑 KeyFlow API Key Manager - Quick Start Setup"
echo "=============================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Copy example env
cp .env.example .env

echo "✅ Created .env file from template"
echo ""
echo "📝 Please configure the following environment variables in .env:"
echo ""
echo "1. DATABASE_URL - Get from Supabase, Neon, or Railway"
echo "2. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY - Get from clerk.com"
echo "3. CLERK_SECRET_KEY - Get from clerk.com"
echo "4. API_SECRET_KEY - Generate with: openssl rand -base64 32"
echo ""
read -p "Have you configured all environment variables? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please configure .env file first, then run this script again"
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📖 For deployment instructions, see DEPLOYMENT.md"
echo ""
