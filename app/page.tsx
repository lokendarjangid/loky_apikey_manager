import Link from 'next/link'
import { Key, BarChart3, Shield, Zap, DollarSign, Code } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Key className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">KeyFlow</span>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/sign-in" 
              className="px-6 py-2 text-white hover:text-purple-300 transition"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6">
            Manage API Keys Like a
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> Pro</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Enterprise-grade API key management with usage tracking, rate limiting, and billing integration. 
            Built for developers who need complete control.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/sign-up" 
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-lg font-semibold"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/docs" 
              className="px-8 py-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition text-lg font-semibold backdrop-blur-sm"
            >
              View Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Key className="h-8 w-8" />}
            title="API Key Generation"
            description="Generate secure, unique API keys with custom prefixes and expiration dates."
          />
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Usage Analytics"
            description="Real-time tracking of API calls, bandwidth, and performance metrics."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Rate Limiting"
            description="Flexible rate limits per key with automatic throttling and alerts."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Lightning Fast"
            description="Sub-millisecond key verification with Redis-backed caching."
          />
          <FeatureCard
            icon={<DollarSign className="h-8 w-8" />}
            title="Billing Integration"
            description="Built-in Stripe integration for usage-based billing and subscriptions."
          />
          <FeatureCard
            icon={<Code className="h-8 w-8" />}
            title="Developer Friendly"
            description="Simple REST API, webhooks, and SDKs for major languages."
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Simple, Transparent Pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            features={[
              "5 API keys",
              "10,000 requests/month",
              "Basic analytics",
              "Community support"
            ]}
          />
          <PricingCard
            name="Pro"
            price="$29"
            features={[
              "Unlimited API keys",
              "1M requests/month",
              "Advanced analytics",
              "Priority support",
              "Webhooks",
              "Custom rate limits"
            ]}
            highlighted
          />
          <PricingCard
            name="Enterprise"
            price="Custom"
            features={[
              "Everything in Pro",
              "Unlimited requests",
              "SLA guarantee",
              "Dedicated support",
              "Custom integrations",
              "White-label options"
            ]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/30">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers managing their API keys with KeyFlow
          </p>
          <Link 
            href="/sign-up" 
            className="inline-block px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-lg font-semibold"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 KeyFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition">
      <div className="text-purple-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function PricingCard({ name, price, features, highlighted = false }: { 
  name: string; 
  price: string; 
  features: string[]; 
  highlighted?: boolean 
}) {
  return (
    <div className={`p-8 rounded-xl border ${
      highlighted 
        ? 'bg-purple-600/20 border-purple-500 scale-105' 
        : 'bg-white/5 border-white/10'
    } backdrop-blur-sm`}>
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <div className="text-4xl font-bold text-white mb-6">
        {price}
        {price !== 'Custom' && <span className="text-lg text-gray-400">/month</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="text-gray-300 flex items-start gap-2">
            <span className="text-purple-400 mt-1">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Link 
        href="/sign-up" 
        className={`block text-center px-6 py-3 rounded-lg transition ${
          highlighted
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        Get Started
      </Link>
    </div>
  )
}
