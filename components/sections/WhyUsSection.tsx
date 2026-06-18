"use client";
import React from 'react'
import Link from 'next/link'

type Item = { icon: string; title: string; subhead: string; desc: string }

type Props = { 
  eyebrow?: string; 
  headline?: string; 
  desc?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items?: Item[];
  layout?: 'split' | 'grid';
}

const WHY_ICONS: Record<string, React.ReactNode> = {
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
      <path d="M12 2C7.5 2 4 5.5 4 10c0 6 8 12 8 12s8-6 8-12c0-4.5-3.5-8-8-8z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 2.222 1.206 4.16 3 5.197.185.107.3.3.3.513v1.79c0 .884.716 1.6 1.6 1.6h5.1z" />
      <circle cx="7.5" cy="10.5" r="1.5" />
      <circle cx="11.5" cy="7.5" r="1.5" />
      <circle cx="16.5" cy="9.5" r="1.5" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a6 6 0 0 1 6 6v3.5c0 3.3-2.7 6-6 6s-6-2.7-6-6V8a6 6 0 0 1 6-6z" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  money: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function getIconForWhyUs(iconStr: string | undefined, title: string): React.ReactNode {
  const normalized = (iconStr || '').toLowerCase().trim();
  if (normalized.startsWith('<svg')) {
    return <div dangerouslySetInnerHTML={{ __html: iconStr! }} style={{ display: 'flex', width: '100%', height: '100%' }} />;
  }

  if (normalized === '🚀' || normalized === 'rocket' || normalized.includes('plus') || normalized.includes('scale')) {
    return WHY_ICONS.rocket;
  }
  if (normalized === '🎨' || normalized === 'palette' || normalized.includes('design') || normalized.includes('redesign') || normalized.includes('art')) {
    return WHY_ICONS.palette;
  }
  if (normalized === '⚙️' || normalized === '⚙' || normalized === 'cog' || normalized === 'gear' || normalized === 'settings' || normalized.includes('app') || normalized.includes('extension')) {
    return WHY_ICONS.settings;
  }
  if (normalized === '🛡️' || normalized === '🛡' || normalized === 'shield' || normalized.includes('maintenance') || normalized.includes('support') || normalized.includes('protect')) {
    return WHY_ICONS.shield;
  }
  if (normalized === '🏆' || normalized === 'trophy' || normalized.includes('partner') || normalized.includes('excellence')) {
    return WHY_ICONS.trophy;
  }
  if (normalized === '💰' || normalized === 'money' || normalized === 'dollar' || normalized.includes('cost') || normalized.includes('price') || normalized.includes('conversion') || normalized.includes('focused')) {
    return WHY_ICONS.money;
  }
  if (normalized === '⚡' || normalized === 'bolt' || normalized === 'flash' || normalized.includes('speed') || normalized.includes('performance') || normalized.includes('fast')) {
    return WHY_ICONS.bolt;
  }
  if (normalized === '🤝' || normalized === 'team' || normalized.includes('dedicated') || normalized.includes('handshake') || normalized.includes('partnership')) {
    return WHY_ICONS.team;
  }
  if (normalized === '🔒' || normalized === 'lock' || normalized.includes('secure') || normalized.includes('security') || normalized.includes('safe')) {
    return WHY_ICONS.lock;
  }
  if (normalized === '📈' || normalized === 'trend' || normalized.includes('results') || normalized.includes('growth') || normalized.includes('roi')) {
    return WHY_ICONS.trend;
  }

  const titleLower = (title || '').toLowerCase();
  if (titleLower.includes('cost') || titleLower.includes('price') || titleLower.includes('afford') || titleLower.includes('excel')) return WHY_ICONS.money;
  if (titleLower.includes('speed') || titleLower.includes('fast') || titleLower.includes('deliver') || titleLower.includes('lightning') || titleLower.includes('performance')) return WHY_ICONS.bolt;
  if (titleLower.includes('support') || titleLower.includes('24/7') || titleLower.includes('help') || titleLower.includes('professional') || titleLower.includes('maintenance')) return WHY_ICONS.shield;
  if (titleLower.includes('result') || titleLower.includes('proven') || titleLower.includes('track') || titleLower.includes('roi') || titleLower.includes('growth') || titleLower.includes('scale')) return WHY_ICONS.trend;
  if (titleLower.includes('team') || titleLower.includes('partner')) return WHY_ICONS.team;
  if (titleLower.includes('app') || titleLower.includes('develop') || titleLower.includes('cod')) return WHY_ICONS.settings;
  if (titleLower.includes('design') || titleLower.includes('style') || titleLower.includes('aesthetic') || titleLower.includes('theme') || titleLower.includes('redesign')) return WHY_ICONS.palette;

  if (iconStr && iconStr.length <= 4) {
    return <span style={{ fontSize: '20px', lineHeight: 1 }}>{iconStr}</span>;
  }

  return WHY_ICONS.default;
}

export default function WhyUsSection({ 
  eyebrow='Why Choose Us', 
  headline='Why 100+ Businesses Trust\nARIOSETECH\nfor Their Success', 
  desc,
  ctaLabel,
  ctaHref,
  items=[],
  layout='split'
}: Props) {
  const F = { fontFamily:'var(--font-display)' } as const
  const safe = Array.isArray(items) ? items : []

  if (layout === 'grid') {
    return (
      <section className="section" style={{ overflow:'visible' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px', maxWidth: '720px', margin: '0 auto 56px' }}>
            {eyebrow && <p className="eyebrow" style={{ justifyContent: 'center', marginBottom: '12px' }}>{eyebrow}</p>}
            <h2 style={{ ...F, fontSize: 'clamp(2rem,4.5vw,3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', color: '#fff', marginBottom: '18px' }}>
              {headline.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </h2>
            {desc && (
              <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8 }}>
                {desc}
              </p>
            )}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: ctaLabel ? '48px' : 0
          }}>
            {safe.map((b, i) => (
              <div 
                key={i} 
                className="sr" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '16px', 
                  padding: '28px', 
                  background: 'rgba(8, 8, 18, 0.6)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '20px', 
                  position: 'relative', 
                  transition: 'all 0.3s var(--ease)', 
                  animationDelay: `${i*0.08}s`,
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'rgba(118,108,255,0.35)';
                  el.style.transform = 'translateY(-6px)';
                  el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'var(--border)';
                  el.style.transform = '';
                  el.style.boxShadow = '';
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(118,108,255,0.3), transparent)', pointerEvents: 'none' }} />
                
                <div style={{ 
                  flexShrink: 0, 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'var(--primary-soft)', 
                  border: '1px solid rgba(118,108,255,0.2)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--primary)', 
                  padding: '12px' 
                }}>
                  {getIconForWhyUs(b.icon, b.title)}
                </div>
                
                <div>
                  <p style={{ ...F, fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{b.title}</p>
                  <p style={{ ...F, fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.subhead}</p>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-3)', lineHeight: 1.75 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {ctaLabel && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <Link href={ctaHref || '/contact'} className="btn btn-primary btn-lg sr">
                {ctaLabel}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="section" style={{ overflow:'visible' }}>
      <div className="container">
        <div className="g-2" style={{ gap:'80px', alignItems:'start' }}>
          <div className="sticky-mobile-fix lg:sticky" style={{ position:'sticky', top:'88px' }}>
            <p className="eyebrow sr">{eyebrow}</p>
            <h2 className="sr" style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.04em', marginBottom:'20px' }}>
              {headline.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i === 1 ? (
                    <span style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                      {line}
                    </span>
                  ) : (
                    <>{line} </>
                  )}
                </React.Fragment>
              ))}
            </h2>
            
            {desc ? (
              <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.85, marginBottom:'32px' }}>{desc}</p>
            ) : (
              <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.85, marginBottom:'32px' }}>We combine world-class expertise with transparent pricing and a genuine commitment to your success. Not just code — business growth.</p>
            )}

            {ctaLabel ? (
              <Link href={ctaHref || "/contact"} className="btn btn-primary btn-lg sr">
                {ctaLabel}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ) : (
              <Link href="/contact" className="btn btn-primary btn-lg sr">
                Start a Project
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            )}
          </div>
          
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            {safe.map((b,i) => (
              <div key={i} className="sr" style={{ display:'flex', gap:'18px', padding:'24px', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', position:'relative', transition:'all 0.25s var(--ease)', animationDelay:`${i*0.08}s` }}
                onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor='rgba(118,108,255,0.35)';el.style.transform='translateX(4px)'}}
                onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='var(--border)';el.style.transform=''}}>
                <div style={{ flexShrink:0, width:'48px', height:'48px', borderRadius:'12px', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)', padding:'12px' }}>
                  {getIconForWhyUs(b.icon, b.title)}
                </div>
                <div>
                  <p style={{ ...F, fontSize:'15px', fontWeight:700, color:'#fff', marginBottom:'3px' }}>{b.title}</p>
                  <p style={{ ...F, fontSize:'12px', fontWeight:600, color:'var(--primary)', marginBottom:'8px' }}>{b.subhead}</p>
                  <p style={{ fontSize:'13px', color:'var(--text-3)', lineHeight:1.75 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
