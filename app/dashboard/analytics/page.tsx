import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BarChart3, TrendingUp, Activity, Clock } from 'lucide-react'

export default async function AnalyticsPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id }
  })

  if (!dbUser) {
    redirect('/sign-in')
  }

  // Get last 30 days of usage
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const usage = await prisma.usage.findMany({
    where: {
      userId: dbUser.id,
      date: {
        gte: thirtyDaysAgo
      }
    },
    orderBy: { date: 'asc' }
  })

  // Aggregate data
  const totalRequests = usage.reduce((sum, u) => sum + u.requestCount, 0)
  const totalSuccess = usage.reduce((sum, u) => sum + u.successCount, 0)
  const totalErrors = usage.reduce((sum, u) => sum + u.errorCount, 0)
  const errorRate = totalRequests > 0 ? (totalErrors / totalRequests * 100).toFixed(2) : '0'

  // Get top API keys by usage
  const keyUsage = await prisma.usage.groupBy({
    by: ['apiKeyId'],
    where: {
      userId: dbUser.id,
      date: {
        gte: thirtyDaysAgo
      }
    },
    _sum: {
      requestCount: true
    },
    orderBy: {
      _sum: {
        requestCount: 'desc'
      }
    },
    take: 5
  })

  const topKeys = await Promise.all(
    keyUsage.map(async (ku) => {
      const key = await prisma.apiKey.findUnique({
        where: { id: ku.apiKeyId }
      })
      return {
        name: key?.name || 'Unknown',
        requests: ku._sum.requestCount || 0
      }
    })
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-600">
          Detailed insights into your API usage over the last 30 days
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Activity className="h-6 w-6" />}
          title="Total Requests"
          value={totalRequests.toLocaleString()}
          color="text-blue-600 bg-blue-100"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          title="Successful"
          value={totalSuccess.toLocaleString()}
          color="text-green-600 bg-green-100"
        />
        <StatCard
          icon={<BarChart3 className="h-6 w-6" />}
          title="Errors"
          value={totalErrors.toLocaleString()}
          color="text-red-600 bg-red-100"
        />
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          title="Error Rate"
          value={`${errorRate}%`}
          color="text-orange-600 bg-orange-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Usage Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Daily Request Volume
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {usage.length === 0 ? (
              <div className="w-full text-center text-slate-400">
                No data available
              </div>
            ) : (
              // Group by date and show bars
              Object.entries(
                usage.reduce((acc, u) => {
                  const date = new Date(u.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  acc[date] = (acc[date] || 0) + u.requestCount
                  return acc
                }, {} as Record<string, number>)
              ).slice(-14).map(([date, count]) => {
                const maxCount = Math.max(...Object.values(
                  usage.reduce((acc, u) => {
                    const d = new Date(u.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    acc[d] = (acc[d] || 0) + u.requestCount
                    return acc
                  }, {} as Record<string, number>)
                ))
                const height = maxCount > 0 ? (count / maxCount * 100) : 0
                
                return (
                  <div key={date} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-purple-500 rounded-t"
                      style={{ height: `${height}%` }}
                      title={`${count} requests`}
                    />
                    <div className="text-xs text-slate-500 mt-2 -rotate-45 origin-top-left">
                      {date}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Top API Keys */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Top API Keys
          </h2>
          {topKeys.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              No usage data available
            </div>
          ) : (
            <div className="space-y-4">
              {topKeys.map((key, index) => {
                const maxRequests = Math.max(...topKeys.map(k => k.requests))
                const percentage = maxRequests > 0 ? (key.requests / maxRequests * 100) : 0
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        {key.name}
                      </span>
                      <span className="text-sm text-slate-500">
                        {key.requests.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 rounded-full h-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Success vs Error Rate */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Success vs Error Rate
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-600">Success Rate</span>
              <span className="text-sm font-semibold text-green-600">
                {totalRequests > 0 ? ((totalSuccess / totalRequests * 100).toFixed(2)) : '0'}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-green-500 rounded-full h-3"
                style={{ width: totalRequests > 0 ? `${(totalSuccess / totalRequests * 100)}%` : '0%' }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-600">Error Rate</span>
              <span className="text-sm font-semibold text-red-600">
                {errorRate}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-red-500 rounded-full h-3"
                style={{ width: `${errorRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }: { 
  icon: React.ReactNode
  title: string
  value: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <div className={`inline-flex p-3 rounded-lg ${color} mb-4`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-sm text-slate-600">{title}</p>
    </div>
  )
}
