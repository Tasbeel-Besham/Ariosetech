'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, Briefcase, Settings, Users, LogOut,
  Menu, Layers, ChevronRight, Image as ImageIcon, Globe, Palette,
  Navigation, Mail, BarChart2, MessageSquare, ChevronDown,
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  {
    label: 'Site Control', icon: Globe, children: [
      { label: 'Pages', href: '/admin/pages', icon: Layers },
      { label: 'Header', href: '/admin/header', icon: Navigation },
      { label: 'Footer', href: '/admin/footer', icon: Navigation },
      { label: 'Menus', href: '/admin/menus', icon: Navigation },
    ],
  },
  {
    label: 'Content', icon: FileText, children: [
      { label: 'Blog Posts', href: '/admin/blogs', icon: FileText },
      { label: 'Service Pages', href: '/admin/services', icon: Layers },
      { label: 'Portfolio', href: '/admin/portfolio', icon: Briefcase },
      { label: 'Media', href: '/admin/media', icon: ImageIcon },
    ],
  },
  {
    label: 'Business', icon: Mail, children: [
      { label: 'Leads / Forms', href: '/admin/leads', icon: MessageSquare },
      { label: 'Contact Forms', href: '/admin/forms', icon: Mail },
    ],
  },
  {
    label: 'Design & Config', icon: Palette, children: [
      { label: 'Theme', href: '/admin/theme', icon: Palette },
      { label: 'Tracking', href: '/admin/tracking', icon: BarChart2 },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Users', href: '/admin/users', icon: Users },
    ],
  },
]

type NavChild = { label: string; href: string; icon: React.FC<{size?: number; style?: React.CSSProperties}> }
type NavItem = { label: string; href?: string; icon: React.FC<{size?: number; style?: React.CSSProperties}>; children?: NavChild[] }

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<string[]>(['Site Control', 'Content', 'Business', 'Design & Config'])
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const toggleGroup = (label: string) => setOpenGroups(g => g.includes(label) ? g.filter(x => x !== label) : [...g, label])

  const SidebarContent = () => (
    <aside style={{
      width: collapsed ? '60px' : '220px', height: '100vh', flexShrink: 0,
      background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s cubic-bezier(0.22,1,0.36,1)',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '14px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '58px' }}>
        {!collapsed && <Image src="https://res.cloudinary.com/daeozrcaf/image/upload/v1776539376/ariosetech/wqycpdxj4iknsfi82fsd.png" alt="ARIOSETECH" width={130} height={32} style={{ height: '26px', width: 'auto', objectFit: 'contain' }} />}
        <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: collapsed ? 'auto' : '0', marginRight: collapsed ? 'auto' : '0' }} className="hover:bg-[var(--bg-3)] hover:text-[var(--text)]">
          <ChevronRight size={15} style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s' }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {(NAV as NavItem[]).map(item => {
          if (!item.children) {
            const active = isActive(item.href!)
            return (
              <Link key={item.href} href={item.href!} title={collapsed ? item.label : undefined} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px',
                textDecoration: 'none', transition: 'all 0.15s',
                background: active ? 'rgba(79,110,247,0.12)' : 'transparent',
                color: active ? 'var(--blue)' : 'var(--text-3)',
                border: active ? '1px solid rgba(79,110,247,0.2)' : '1px solid transparent',
                whiteSpace: 'nowrap', overflow: 'hidden',
              }} className={!active ? 'hover:bg-[var(--bg-3)] hover:text-[var(--text-2)]' : ''}>
                <item.icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ fontSize: '13px', fontWeight: active ? 600 : 500, fontFamily: 'var(--font-body)' }}>{item.label}</span>}
              </Link>
            )
          }

          const anyActive = item.children.some(c => isActive(c.href))
          const groupOpen = openGroups.includes(item.label) || anyActive

          return (
            <div key={item.label}>
              <button onClick={() => !collapsed && toggleGroup(item.label)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px',
                background: anyActive ? 'rgba(79,110,247,0.06)' : 'transparent',
                border: 'none', cursor: 'pointer', color: anyActive ? 'var(--blue)' : 'var(--text-3)',
                transition: 'all 0.15s', whiteSpace: 'nowrap', overflow: 'hidden', justifyContent: 'flex-start',
              }} className="hover:bg-[var(--bg-3)] hover:text-[var(--text-2)]">
                <item.icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && (
                  <>
                    <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1, textAlign: 'left' }}>{item.label}</span>
                    <ChevronDown size={12} style={{ transform: groupOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </>
                )}
              </button>
              {!collapsed && groupOpen && (
                <div style={{ paddingLeft: '10px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {item.children.map(child => {
                    const active = isActive(child.href)
                    return (
                      <Link key={child.href} href={child.href} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '8px',
                        textDecoration: 'none', transition: 'all 0.15s',
                        background: active ? 'rgba(79,110,247,0.12)' : 'transparent',
                        color: active ? 'var(--blue)' : 'var(--text-3)',
                        borderLeft: active ? '2px solid var(--blue)' : '2px solid transparent',
                        whiteSpace: 'nowrap', overflow: 'hidden',
                      }} className={!active ? 'hover:bg-[var(--bg-3)] hover:text-[var(--text-2)]' : ''}>
                        <child.icon size={14} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', fontWeight: active ? 600 : 400, fontFamily: 'var(--font-body)' }}>{child.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
        <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-3)', transition: 'all 0.15s', whiteSpace: 'nowrap', overflow: 'hidden' }} className="hover:bg-[rgba(255,77,109,0.1)] hover:text-[#ff4d6d]">
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: '13px', fontFamily: 'var(--font-body)' }}>Log out</span>}
        </button>
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Desktop */}
      <div className="hidden lg:block" style={{ width: collapsed ? '60px' : '220px', flexShrink: 0, transition: 'width 0.25s cubic-bezier(0.22,1,0.36,1)', position: 'relative' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40 }}>
          <SidebarContent />
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 39, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileOpen(false)} />}
      {mobileOpen && (
        <div className="lg:hidden" style={{ position: 'fixed', top: 0, left: 0, zIndex: 50 }}>
          <SidebarContent />
        </div>
      )}

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
        <div className="lg:hidden" style={{ height: '58px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
          <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: '4px' }}>
            <Menu size={20} />
          </button>
          <Image src="https://res.cloudinary.com/daeozrcaf/image/upload/v1776539376/ariosetech/wqycpdxj4iknsfi82fsd.png" alt="ARIOSETECH" width={120} height={30} style={{ height: '24px', width: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1 }}>{children}</div>
      </main>
    </div>
  )
}
