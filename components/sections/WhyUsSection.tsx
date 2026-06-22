"use client";
import React from 'react'
import Link from 'next/link'

type Item = { 
  icon: string; 
  title: string; 
  subhead: string; 
  desc: string; 
  features?: string; 
  price?: string; 
  href?: string; 
}

type Props = { 
  eyebrow?: string; 
  headline?: string; 
  desc?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items?: Item[];
  layout?: 'split' | 'grid' | 'rows';
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

function getHashIdFromTitle(title: string): string | undefined {
  const t = (title || '').toLowerCase();
  if (t.includes('speed') || t.includes('performance')) return 'speed';
  if (t.includes('security')) return 'security';
  if (t.includes('virus') || t.includes('malware')) return 'virus-removal';
  if (t.includes('backup')) return 'backup';
  if (t.includes('redesign') || t.includes('re-design')) return 'redesign';
  if (t.includes('multilingual') || t.includes('translation') || t.includes('global')) return 'multilingual';
  if (t.includes('theme') || t.includes('customization')) return 'theme';
  if (t.includes('payment')) return 'payments';
  if (t.includes('multivendor') || t.includes('multi-vendor')) return 'multivendor';
  if (t.includes('setup') || t.includes('configuration')) return 'setup';
  if (t.includes('integration')) return 'integrations';
  if (t.includes('plus')) return 'plus';
  if (t.includes('app dev') || t.includes('app development')) return 'app-dev';
  if (t.includes('migration')) return 'migration';
  if (t.includes('maintenance')) return 'maintenance';
  
  // Slugify fallback
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function renderFormattedContent(text: string, variant?: 'pills') {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: { type: 'ol' | 'ul'; items: string[] } | null = null;

  const flushList = (key: string | number) => {
    if (!currentList) return;
    const ListTag = currentList.type;
    
    if (variant === 'pills' && currentList.type === 'ul') {
      elements.push(
        <div 
          key={`list-${key}`} 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px', 
            marginTop: '12px', 
            marginBottom: '16px' 
          }}
        >
          {currentList.items.map((item, idx) => (
            <div key={idx} style={{ 
              background: 'rgba(118, 108, 255, 0.1)', 
              border: '1px solid rgba(118, 108, 255, 0.2)', 
              color: '#fff', 
              padding: '8px 16px', 
              borderRadius: '100px', 
              fontSize: '13px', 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: 'var(--primary)', fontSize: '14px' }}>✓</span>
              {parseInlineMarkdown(item)}
            </div>
          ))}
        </div>
      );
    } else {
      elements.push(
        <ListTag 
          key={`list-${key}`} 
          style={{ 
            margin: '0 0 16px 16px', 
            padding: 0,
            listStyleType: currentList.type === 'ol' ? 'decimal' : 'disc',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} style={{ fontSize: '13.5px', lineHeight: '1.65', color: 'var(--text-2)' }}>
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ListTag>
      );
    }
    currentList = null;
  };

  const parseInlineMarkdown = (str: string) => {
    const parts = str.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} style={{ color: '#fff', fontWeight: 600 }}>{part}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentList) flushList(i);
      return;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    const bulletMatch = trimmed.match(/^([•\*\-])\s+(.*)$/);

    if (numMatch) {
      if (!currentList || currentList.type !== 'ol') {
        if (currentList) flushList(i);
        currentList = { type: 'ol', items: [numMatch[2]] };
      } else {
        currentList.items.push(numMatch[2]);
      }
    } else if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        if (currentList) flushList(i);
        currentList = { type: 'ul', items: [bulletMatch[2]] };
      } else {
        currentList.items.push(bulletMatch[2]);
      }
    } else {
      if (currentList) flushList(i);
      elements.push(
        <p key={`p-${i}`} style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.75, marginBottom: '12px' }}>
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  if (currentList) flushList('end');

  return <div className="formatted-content">{elements}</div>;
}

function renderBentoContent(text: string) {
  if (!text) return null;
  
  const lines = text.split('\n');
  let introPara: string[] = [];
  let columns: { title: string, items: string[] }[] = [];
  let outroPara: string[] = [];
  let currentColumn = -1;
  let parsingColumns = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    
    // Lookahead to see if it's a column
    let isColumnHeader = false;
    if (t.startsWith('•')) {
      const colonIdx = t.indexOf(':');
      const nextLine = (i + 1 < lines.length) ? lines[i+1].trim() : '';
      if (colonIdx !== -1 || nextLine.startsWith('-')) {
        isColumnHeader = true;
      }
    }

    if (isColumnHeader) {
      parsingColumns = true;
      const colonIdx = t.indexOf(':');
      if (colonIdx !== -1) {
        const title = t.substring(1, colonIdx).trim();
        const contentStr = t.substring(colonIdx + 1).trim();
        let items: string[] = [];
        if (contentStr) {
           items = contentStr.split(',').map(s => s.trim()).filter(Boolean);
        }
        columns.push({ title, items });
        currentColumn++;
      } else {
        columns.push({ title: t.substring(1).trim(), items: [] });
        currentColumn++;
      }
    } else if (t.startsWith('-') && parsingColumns && currentColumn >= 0) {
      columns[currentColumn].items.push(t.substring(1).trim());
    } else {
      if (!parsingColumns) {
        if (t) introPara.push(t);
      } else {
        if (t) outroPara.push(t);
      }
    }
  }

  if (columns.length > 0 && columns.some(c => c.items.length > 0)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {introPara.length > 0 && (
          <div style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.7 }}>
            {renderFormattedContent(introPara.join('\n'))}
          </div>
        )}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`, 
          gap: '20px', 
          marginTop: '8px' 
        }}>
          {columns.map((col, idx) => (
            <div key={idx} style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.06)', 
              borderRadius: '16px', 
              padding: '24px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                {col.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '10px', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {outroPara.length > 0 && (
          <div style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.7, marginTop: '16px' }}>
            {renderFormattedContent(outroPara.join('\n'), 'pills')}
          </div>
        )}
      </div>
    )
  }
  
  return renderFormattedContent(text);
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
  const M = { fontFamily: 'var(--font-mono)' } as const
  const safe = Array.isArray(items) ? items : []

  if (layout === 'bento-table') {
    return (
      <section className="section" style={{ overflow: 'visible', background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '720px', margin: '0 auto 64px' }}>
            {eyebrow && <p className="eyebrow" style={{ justifyContent: 'center', marginBottom: '16px' }}>{eyebrow}</p>}
            <h2 style={{ ...F, fontSize: 'clamp(2rem,4.5vw,3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', color: '#fff', marginBottom: '20px' }}>
              {headline.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </h2>
            {desc && (
              <p style={{ fontSize: '15.5px', color: 'var(--text-2)', lineHeight: 1.8 }}>
                {desc}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {safe.map((b, i) => (
              <div 
                key={i} 
                id={getHashIdFromTitle(b.title)}
                className="sr" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: '40px', 
                  background: 'rgba(8, 8, 18, 0.7)', 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  borderRadius: '24px', 
                  position: 'relative', 
                  transition: 'all 0.4s var(--ease)',
                  scrollMarginTop: '100px'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', borderRadius: '24px', background: 'radial-gradient(ellipse at center, rgba(118,108,255,0.03) 0%, transparent 60%)' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', position: 'relative' }}>
                  <div style={{ 
                    flexShrink: 0, 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '14px', 
                    background: 'var(--primary-soft)', 
                    border: '1px solid rgba(118,108,255,0.2)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'var(--primary)', 
                    padding: '14px' 
                  }}>
                    {getIconForWhyUs(b.icon, b.title)}
                  </div>
                  <div>
                    <h3 style={{ ...F, fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '6px', letterSpacing: '-0.02em' }}>{b.title}</h3>
                    <p style={{ ...F, fontSize: '12px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{b.subhead}</p>
                  </div>
                  
                  {(b.price || b.href) && (
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
                      {b.price && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', display: 'none' /* hide price on mobile, or keep flex and hide with media query, we will just show it inline */ }} className="hidden md-flex">
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-4)', letterSpacing: '0.05em', marginBottom: '2px' }}>Starting at</span>
                          <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{b.price}</span>
                        </div>
                      )}
                      {b.href && (
                        <Link href={b.href} className="btn btn-primary btn-md" style={{ flexShrink: 0, padding: '12px 24px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Get Started
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                
                <div style={{ position: 'relative' }}>
                  {renderBentoContent(b.desc)}
                </div>
              </div>
            ))}
          </div>
          
          {ctaLabel && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
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

  if (layout === 'rows') {
    return (
      <section className="section" style={{ overflow: 'visible', background: 'linear-gradient(180deg, var(--bg-2) 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ marginBottom: '56px', maxWidth: '720px' }}>
            {eyebrow && <p className="eyebrow" style={{ marginBottom: '12px' }}>{eyebrow}</p>}
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

          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {safe.map((b, i) => (
              <div 
                key={i} 
                id={getHashIdFromTitle(b.title)}
                className="premium-row sr" 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1.2fr 1fr 220px',
                  gap: '40px', 
                  padding: '40px 0', 
                  alignItems: 'center',
                  position: 'relative',
                  scrollMarginTop: '100px'
                }}
              >
                {/* Column 1: Icon & Title & Desc */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
                  <div className="row-icon-container" style={{ 
                    flexShrink: 0, 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'var(--primary)', 
                    padding: '12px' 
                  }}>
                    {getIconForWhyUs(b.icon, b.title)}
                  </div>
                  <div>
                    <h3 className="row-title" style={{ ...F, fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '4px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{b.title}</h3>
                    <p style={{ ...F, fontSize: '11px', fontWeight: 600, color: 'var(--primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{b.subhead}</p>
                    {renderFormattedContent(b.desc)}
                  </div>
                </div>

                {/* Column 2: Features checklist */}
                <div className="premium-row__features-col">
                  {b.features && (
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0, listStyle: 'none' }}>
                      {b.features.split(',').map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-2)' }}>
                          <div style={{ 
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '4px', 
                            background: 'rgba(118, 108, 255, 0.1)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span style={{ fontSize: '13.5px', color: 'var(--text-2)' }}>{feat.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Column 3: Price & CTA button */}
                <div className="premium-row__cta-col" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-end', 
                  justifyContent: 'center', 
                  gap: '16px',
                  borderLeft: '1px solid rgba(255,255,255,0.06)',
                  paddingLeft: '32px',
                  height: '100%'
                }}>
                  {b.price && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: '2px' }}>Starting at</span>
                      <span style={{ fontSize: '26px', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{b.price}</span>
                    </div>
                  )}
                  {b.href && (
                    <Link href={b.href} className="btn btn-primary btn-md" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <style>{`
            .premium-row {
              border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
              background: transparent !important;
            }
            .premium-row:hover {
              border-bottom-color: rgba(118, 108, 255, 0.35) !important;
              background: radial-gradient(circle at 5% 50%, rgba(118, 108, 255, 0.04) 0%, transparent 60%) !important;
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
            .premium-row .row-title {
              color: #fff !important;
              transition: color 0.4s var(--ease) !important;
            }
            .premium-row:hover .row-title {
              color: var(--primary) !important;
              text-shadow: 0 0 15px rgba(118, 108, 255, 0.2);
            }
            .premium-row .row-icon-container {
              border-color: rgba(255,255,255,0.06) !important;
              background: rgba(255,255,255,0.02) !important;
              border: 1px solid rgba(255,255,255,0.06) !important;
              transition: all 0.4s var(--ease) !important;
            }
            .premium-row:hover .row-icon-container {
              border-color: rgba(118,108,255,0.3) !important;
              background: var(--primary-soft) !important;
              transform: rotate(5deg) scale(1.05);
            }
            
            @media (max-width: 991px) {
              .premium-row {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
                padding: 32px 16px !important;
              }
              .premium-row:hover {
                padding-left: 16px !important;
                padding-right: 16px !important;
                background: transparent !important;
              }
              .premium-row__cta-col {
                border-left: none !important;
                padding-left: 0 !important;
                align-items: flex-start !important;
                width: 100% !important;
              }
              .premium-row__cta-col > div {
                align-items: flex-start !important;
              }
              .premium-row__cta-col a {
                width: 100% !important;
                max-width: 280px !important;
              }
            }
          `}</style>
        </div>
      </section>
    )
  }

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
                id={getHashIdFromTitle(b.title)}
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
                  scrollMarginTop: '100px'
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
                
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <p style={{ ...F, fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{b.title}</p>
                  <p style={{ ...F, fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.subhead}</p>
                  {renderFormattedContent(b.desc)}
                  
                  {b.features && (
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: '16px 0 24px 0', listStyle: 'none', fontSize: '13px' }}>
                      {b.features.split(',').map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-2)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{feat.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {(b.price || b.href) && (
                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      {b.price && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-4)', letterSpacing: '0.05em' }}>Starting at</span>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{b.price}</span>
                        </div>
                      )}
                      {b.href && (
                        <Link href={b.href} className="btn btn-primary btn-sm" style={{ padding: '6px 14px', fontSize: '11.5px', fontWeight: 600, borderRadius: '8px' }}>
                          Get Started
                        </Link>
                      )}
                    </div>
                  )}
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
              <div key={i} id={getHashIdFromTitle(b.title)} className="sr" style={{ display:'flex', gap:'18px', padding:'24px', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', position:'relative', transition:'all 0.25s var(--ease)', animationDelay:`${i*0.08}s`, scrollMarginTop: '100px' }}
                onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor='rgba(118,108,255,0.35)';el.style.transform='translateX(4px)'}}
                onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='var(--border)';el.style.transform=''}}>
                <div style={{ flexShrink:0, width:'48px', height:'48px', borderRadius:'12px', background:'var(--primary-soft)', border:'1px solid rgba(118,108,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)', padding:'12px' }}>
                  {getIconForWhyUs(b.icon, b.title)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <p style={{ ...F, fontSize:'15px', fontWeight:700, color:'#fff', marginBottom:'3px' }}>{b.title}</p>
                  <p style={{ ...F, fontSize:'12px', fontWeight:600, color:'var(--primary)', marginBottom:'8px' }}>{b.subhead}</p>
                  {renderFormattedContent(b.desc)}

                  {b.features && (
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: '16px 0 24px 0', listStyle: 'none', fontSize: '13px' }}>
                      {b.features.split(',').map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-2)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{feat.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {(b.price || b.href) && (
                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      {b.price && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-4)', letterSpacing: '0.05em' }}>Starting at</span>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{b.price}</span>
                        </div>
                      )}
                      {b.href && (
                        <Link href={b.href} className="btn btn-primary btn-sm" style={{ padding: '6px 14px', fontSize: '11.5px', fontWeight: 600, borderRadius: '8px' }}>
                          Get Started
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
