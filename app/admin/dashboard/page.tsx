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
    { label: 'Blog Posts',      value: stats.blogs,     href: '/admin/blogs',     icon: FileText },
    { label: 'Portfolio Items', value: stats.portfolio, href: '/admin/portfolio', icon: Briefcase },
    { label: 'Pages',           value: stats.pages,     href: '/admin/pages',     icon: Layers },
    { label: 'Leads',           value: stats.leads,     href: '/admin/leads',     icon: MessageSquare,
      badge: stats.newLeads > 0 ? `${stats.newLeads} new` : undefined },
  ]

  const quickLinks = [
    { label: 'New Blog Post',        href: '/admin/blogs/new' },
    { label: 'New Portfolio Item',   href: '/admin/portfolio' },
    { label: 'New Page',             href: '/admin/pages' },
    { label: 'Header Builder',       href: '/admin/header' },
    { label: 'Footer Builder',       href: '/admin/footer' },
    { label: 'Menus',                href: '/admin/menus' },
    { label: 'Theme Settings',       href: '/admin/theme' },
    { label: 'Tracking & Analytics', href: '/admin/tracking' },
  ]

  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-extrabold text-white tracking-tight mb-1.5">
            Dashboard
          </h1>
          <p className="text-sm text-text-3">Welcome back, here&apos;s your site overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {statCards.map(({ label, value, href, icon: Icon, badge }) => (
            <Link key={label} href={href} className="group block no-underline bg-bg-2 border border-border rounded-2xl p-6 transition-all duration-200 hover:border-primary/30 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  {badge && <span className="bg-primary text-white font-mono text-[10px] font-bold py-0.5 px-2 rounded-full">{badge}</span>}
                  <ArrowRight size={14} className="text-text-3 transition-transform group-hover:translate-x-0.5" />
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
              {quickLinks.map(({ label, href }) => (
                <Link key={label} href={href} className="flex items-center gap-2 py-2.5 px-3.5 rounded-xl no-underline bg-bg-3 border border-border transition-all duration-150 hover:border-primary/30 hover:bg-primary/5">
                  <Plus size={13} className="text-primary shrink-0" />
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
                <Link key={label} href={href} target={external ? '_blank' : undefined} className="flex items-center gap-3.5 p-3.5 rounded-xl no-underline bg-bg-3 border border-border transition-all duration-150 hover:border-primary/30 hover:bg-primary/5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-primary" />
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
