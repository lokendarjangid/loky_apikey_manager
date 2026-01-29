import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Key, LayoutDashboard, FolderOpen, BarChart3, Settings, CreditCard } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Key className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-slate-900">KeyFlow</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            <NavLink href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />}>
              Dashboard
            </NavLink>
            <NavLink href="/dashboard/projects" icon={<FolderOpen className="h-5 w-5" />}>
              Projects
            </NavLink>
            <NavLink href="/dashboard/keys" icon={<Key className="h-5 w-5" />}>
              API Keys
            </NavLink>
            <NavLink href="/dashboard/analytics" icon={<BarChart3 className="h-5 w-5" />}>
              Analytics
            </NavLink>
            <NavLink href="/dashboard/billing" icon={<CreditCard className="h-5 w-5" />}>
              Billing
            </NavLink>
            <NavLink href="/dashboard/settings" icon={<Settings className="h-5 w-5" />}>
              Settings
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition"
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  )
}
