'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/layout/AdminShell'
import { FileText, Briefcase, Layers, MessageSquare, ArrowRight, Plus, Globe, Settings } from 'lucide-react'

type Stats = { blogs: number; portfolio: number; pages: number; leads: number; newLeads: number }

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ blogs: 0, portfolio: 0, pages: 0, leads: 0, newLeads: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/blogs?admin=1').then(r => r.json()),
      fetch('/api/portfolio?admin=1').then(r => r.json()),
      fetch('/api/pages').then(r => r.json()),
      fetch('/api/leads').then(r => r.json()),
    ]).then(([blogs, portfolio, pages, leads]) => {
      const leadsArr = Array.isArray(leads) ? leads : []
      setStats({
        blogs: blogs.length,
        portfolio: portfolio.length,
        pages: pages.length,
        leads: leadsArr.length,
        newLeads: leadsArr.filter((l: { status: string }) => l.status === 'new').length,
      })
    })
  }, [])

  const statCards = [
    { label: 'Blog Posts',      value: stats.blogs,     href: '/admin/blogs',     icon: FileText,       color: '#4f6ef7' },
    { label: 'Portfolio Items', value: stats.portfolio, href: '/admin/portfolio', icon: Briefcase,      color: '#9b6dff' },
    { label: 'Pages',           value: stats.pages,     href: '/admin/pages',     icon: Layers,         color: '#00e5a0' },
    { label: 'Leads',           value: stats.leads,     href: '/admin/leads',     icon: MessageSquare,  color: '#fbbf24',
      badge: stats.newLeads > 0 ? `${stats.newLeads} new` : undefined },
  ]

  const quickLinks = [
    { label: 'New Blog Post',      href: '/admin/blogs/new',    color: '#4f6ef7' },
    { label: 'New Portfolio Item', href: '/admin/portfolio',    color: '#9b6dff' },
    { label: 'New Page',           href: '/admin/pages',        color: '#00e5a0' },
    { label: 'Header Builder',     href: '/admin/header',       color: '#fbbf24' },
    { label: 'Footer Builder',     href: '/admin/footer',       color: '#00e5a0' },
    { label: 'Menus',              href: '/admin/menus',        color: '#4f6ef7' },
    { label: 'Theme Settings',     href: '/admin/theme',        color: '#9b6dff' },
    { label: 'Tracking & Analytics', href: '/admin/tracking',  color: '#fbbf24' },
  ]

  return (
    <AdminShell>
      <div style={{ padding: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>Welcome back — here&apos;s your site overview.</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {statCards.map(({ label, value, href, icon: Icon, color, badge }) => (
            <Link key={label} href={href} style={{ display: 'block', textDecoration: 'none', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', transition: 'all 0.2s' }} className="hover:border-[var(--border-2)] hover:-translate-y-1">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {badge && <span style={{ background: 'var(--blue)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px' }}>{badge}</span>}
                  <ArrowRight size={14} style={{ color: 'var(--text-3)' }} />
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1, marginBottom: '6px' }}>{value}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Quick actions */}
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {quickLinks.map(({ label, href, color }) => (
                <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', textDecoration: 'none', background: 'var(--bg-3)', border: '1px solid var(--border)', transition: 'all 0.15s' }} className="hover:border-[var(--border-2)]">
                  <Plus size={13} style={{ color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-2)', fontFamily: 'var(--font-body)' }}>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Site control */}
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>Site Control</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'View Live Site', href: '/', icon: Globe, desc: 'Open ariosetech.com', external: true },
                { label: 'Page Builder', href: '/admin/pages', icon: Layers, desc: 'Create & edit pages' },
                { label: 'Settings', href: '/admin/settings', icon: Settings, desc: 'Site configuration' },
              ].map(({ label, href, icon: Icon, desc, external }) => (
                <Link key={label} href={href} target={external ? '_blank' : undefined} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '12px', textDecoration: 'none', background: 'var(--bg-3)', border: '1px solid var(--border)', transition: 'all 0.15s' }} className="hover:border-[var(--border-2)]">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} style={{ color: 'var(--blue)' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{label}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{desc}</p>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--text-3)', marginLeft: 'auto' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
