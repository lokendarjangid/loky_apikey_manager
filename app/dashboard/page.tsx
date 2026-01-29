import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Key, Activity, AlertCircle, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // Get or create user in database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      apiKeys: {
        where: { status: 'active' }
      },
      projects: true
    }
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
        imageUrl: user.imageUrl,
      },
      include: {
        apiKeys: {
          where: { status: 'active' }
        },
        projects: true
      }
    })
  }

  // Get usage statistics
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayUsage = await prisma.usage.aggregate({
    where: {
      userId: dbUser.id,
      date: {
        gte: today
      }
    },
    _sum: {
      requestCount: true,
      successCount: true,
      errorCount: true
    }
  })

  // Get this month's usage
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthUsage = await prisma.usage.aggregate({
    where: {
      userId: dbUser.id,
      date: {
        gte: monthStart
      }
    },
    _sum: {
      requestCount: true
    }
  })

  const stats = [
    {
      name: 'Active API Keys',
      value: dbUser.apiKeys.length.toString(),
      icon: Key,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      name: 'Requests Today',
      value: (todayUsage._sum.requestCount || 0).toLocaleString(),
      icon: Activity,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'This Month',
      value: (monthUsage._sum.requestCount || 0).toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'Error Rate',
      value: todayUsage._sum.requestCount 
        ? `${((todayUsage._sum.errorCount || 0) / todayUsage._sum.requestCount * 100).toFixed(1)}%`
        : '0%',
      icon: AlertCircle,
      color: 'text-red-600 bg-red-100'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {user.firstName || 'there'}!
        </h1>
        <p className="text-slate-600">
          Here's an overview of your API key usage and performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
            <p className="text-sm text-slate-600">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction 
            href="/dashboard/keys" 
            title="Create API Key"
            description="Generate a new API key for your project"
          />
          <QuickAction 
            href="/dashboard/projects" 
            title="New Project"
            description="Start a new project and organize your keys"
          />
          <QuickAction 
            href="/dashboard/analytics" 
            title="View Analytics"
            description="Deep dive into your usage statistics"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent API Keys</h2>
        {dbUser.apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <Key className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">No API keys yet</p>
            <a 
              href="/dashboard/keys" 
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Create Your First Key
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {dbUser.apiKeys.slice(0, 5).map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{key.name}</p>
                  <p className="text-sm text-slate-500 font-mono">{key.prefix}...</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">
                    {key.lastUsedAt 
                      ? `Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`
                      : 'Never used'
                    }
                  </p>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function QuickAction({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <a 
      href={href}
      className="block p-4 border-2 border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition"
    >
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </a>
  )
}
