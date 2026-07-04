'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/layout/AdminShell'
import { FileText, Briefcase, Layers, MessageSquare, ArrowRight, Plus, Globe, Settings } from '@/components/ui/Icons'

type Stats = { blogs: number; portfolio: number; pages: number; leads: number; newLeads: number; services: number }

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ blogs: 0, portfolio: 0, pages: 0, leads: 0, newLeads: 0, services: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/blogs?admin=1').then(r => r.json()),
      fetch('/api/portfolio?admin=1').then(r => r.json()),
      fetch('/api/pages').then(r => r.json()),
      fetch('/api/leads').then(r => r.json()),
      fetch('/api/services').then(r => r.json()),
    ]).then(([blogs, portfolio, pages, leads, services]) => {
      const leadsArr = Array.isArray(leads) ? leads : []
      setStats({
        blogs: blogs.length,
        portfolio: portfolio.length,
        pages: pages.length,
        leads: leadsArr.length,
        newLeads: leadsArr.filter((l: { status: string }) => l.status === 'new').length,
        services: Array.isArray(services) ? services.length : 0,
      })
    })
  }, [])

  const statCards = [
    { label: 'Blog Posts',      value: stats.blogs,     href: '/admin/blogs',     icon: FileText,       colorClass: 'text-blue-500', bgClass: 'bg-blue-500/10', borderClass: 'border-blue-500/20' },
    { label: 'Portfolio Items', value: stats.portfolio, href: '/admin/portfolio', icon: Briefcase,      colorClass: 'text-purple-500', bgClass: 'bg-purple-500/10', borderClass: 'border-purple-500/20' },
    { label: 'Pages',           value: stats.pages,     href: '/admin/pages',     icon: Layers,         colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/20' },
    { label: 'Leads',           value: stats.leads,     href: '/admin/leads',     icon: MessageSquare,  colorClass: 'text-amber-500', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/20',
      badge: stats.newLeads > 0 ? `${stats.newLeads} new` : undefined },
  ]

  const quickLinks = [
    { label: 'New Blog Post',      href: '/admin/blogs/new',    colorClass: 'text-blue-500' },
    { label: 'New Portfolio Item', href: '/admin/portfolio',    colorClass: 'text-purple-500' },
    { label: 'New Page',           href: '/admin/pages',        colorClass: 'text-emerald-500' },
    { label: 'Header Builder',     href: '/admin/header',       colorClass: 'text-amber-500' },
    { label: 'Footer Builder',     href: '/admin/footer',       colorClass: 'text-emerald-500' },
    { label: 'Menus',              href: '/admin/menus',        colorClass: 'text-blue-500' },
    { label: 'Theme Settings',     href: '/admin/theme',        colorClass: 'text-purple-500' },
    { label: 'Tracking & Analytics', href: '/admin/tracking',  colorClass: 'text-amber-500' },
  ]

  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-extrabold text-white tracking-tight mb-1.5">
            Dashboard
          </h1>
          <p className="text-sm text-text-3">Welcome back — here&apos;s your site overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {statCards.map(({ label, value, href, icon: Icon, colorClass, bgClass, borderClass, badge }) => (
            <Link key={label} href={href} className="block no-underline bg-bg-2 border border-border rounded-2xl p-6 transition-all duration-200 hover:border-border-2 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${bgClass} border ${borderClass} flex items-center justify-center`}>
                  <Icon size={18} className={colorClass} />
                </div>
                <div className="flex items-center gap-2">
                  {badge && <span className="bg-[color:var(--blue)] text-white font-mono text-[10px] font-bold py-0.5 px-2 rounded-full">{badge}</span>}
                  <ArrowRight size={14} className="text-text-3" />
                </div>
              </div>
              <p className="font-display text-[2rem] font-extrabold text-white leading-none mb-1.5">{value}</p>
              <p className="font-mono text-[11px] text-text-3 uppercase tracking-wider">{label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          {/* Quick actions */}
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h2 className="font-display text-base font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
              {quickLinks.map(({ label, href, colorClass }) => (
                <Link key={label} href={href} className="flex items-center gap-2 py-2.5 px-3.5 rounded-xl no-underline bg-bg-3 border border-border transition-all duration-150 hover:border-border-2">
                  <Plus size={13} className={`${colorClass} shrink-0`} />
                  <span className="text-[13px] font-medium text-text-2 font-body">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Site control */}
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <h2 className="font-display text-base font-bold text-white mb-4">Site Control</h2>
            <div className="flex flex-col gap-2">
              {[
                { label: 'View Live Site', href: '/', icon: Globe, desc: 'Open ariosetech.com', external: true },
                { label: 'Page Builder', href: '/admin/pages', icon: Layers, desc: 'Create & edit pages' },
                { label: 'Settings', href: '/admin/settings', icon: Settings, desc: 'Site configuration' },
              ].map(({ label, href, icon: Icon, desc, external }) => (
                <Link key={label} href={href} target={external ? '_blank' : undefined} className="flex items-center gap-3.5 p-3.5 rounded-xl no-underline bg-bg-3 border border-border transition-all duration-150 hover:border-border-2">
                  <div className="w-9 h-9 rounded-xl bg-[rgba(79,110,247,0.1)] border border-[rgba(79,110,247,0.2)] flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[color:var(--blue)]" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-white">{label}</p>
                    <p className="font-mono text-[11px] text-text-3 mt-0.5">{desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-text-3 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
