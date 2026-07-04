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
  layout?: 'split' | 'grid' | 'rows' | 'bento-table';
}

const WHY_ICONS: Record<string, React.ReactNode> = {
  rocket: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon-fill">
      <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
      <path d="M12 2C7.5 2 4 5.5 4 10c0 6 8 12 8 12s8-6 8-12c0-4.5-3.5-8-8-8z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  ),
  palette: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon-fill">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 2.222 1.206 4.16 3 5.197.185.107.3.3.3.513v1.79c0 .884.716 1.6 1.6 1.6h5.1z" />
      <circle cx="7.5" cy="10.5" r="1.5" />
      <circle cx="11.5" cy="7.5" r="1.5" />
      <circle cx="16.5" cy="9.5" r="1.5" />
    </svg>
  ),
  settings: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon-fill">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  shield: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon-fill">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  trophy: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon-fill">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a6 6 0 0 1 6 6v3.5c0 3.3-2.7 6-6 6s-6-2.7-6-6V8a6 6 0 0 1 6-6z" />
    </svg>
  ),
  lock: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon-fill">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  bolt: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon-fill">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  money: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon-fill">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  trend: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon-fill">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  team: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon-fill">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  default: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon-fill">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function getIconForWhyUs(iconStr: string | undefined, title: string): React.ReactNode {
  const normalized = (iconStr || '').toLowerCase().trim();
  if (normalized.startsWith('<svg')) {
    return <div dangerouslySetInnerHTML={{ __html: iconStr! }} className="flex icon-fill" />;
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
    return <span className="emoji-icon">{iconStr}</span>;
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
          className="pill-list"
        >
          {currentList.items.map((item, idx) => (
            <div key={idx} className="pill-item">
              <span className="pill-check">✓</span>
              {parseInlineMarkdown(item)}
            </div>
          ))}
        </div>
      );
    } else {
      elements.push(
        <ListTag 
          key={`list-${key}`} 
          className={currentList.type === 'ol' ? 'md-list md-list-ol' : 'md-list md-list-ul'}
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} className="md-li">
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
        return <strong key={i} className="md-strong">{part}</strong>;
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
        <p key={`p-${i}`} className="md-para">
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
      <div className="flex flex-col gap-24">
        {introPara.length > 0 && (
          <div className="bento-intro">
            {renderFormattedContent(introPara.join('\n'))}
          </div>
        )}
        <div className="bento-cols">
          {columns.map((col, idx) => (
            <div key={idx} className="card-hover bento-col">
              <h4 className="bento-col-title">
                {col.title}
              </h4>
              <ul className="bento-col-list">
                {col.items.map((item, i) => (
                  <li key={i} className="bento-col-li">
                    <span className="bento-check">
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
          <div className="bento-intro mt-16">
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
      <section className="section overflow-visible bg-subtle">
        <div className="container">
          <div className="text-center mb-64 max-w-720 mx-auto">
            {eyebrow && <p className="eyebrow justify-center mb-16">{eyebrow}</p>}
            <h2 className="font-display font-extrabold text-white mb-20 leading-tight tracking-tighter section-headline">
              {headline.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </h2>
            {desc && (
              <p className="text-gray-2 leading-loose text-15">
                {desc}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-32">
            {safe.map((b, i) => (
              <div 
                key={i} 
                id={getHashIdFromTitle(b.title)}
                className="sr card-hover flex flex-col p-40 rounded-2xl relative bg-subtle-2 border-subtle-2 scroll-mt-100"
              >
                <div className="absolute inset-0 rounded-2xl pointer-events-none card-halo" />
                
                <div className="flex items-center gap-20 mb-32 relative">
                  <div className="shrink-0 flex items-center justify-center rounded-xl bg-soft text-primary icon-tile icon-tile-56">
                    {getIconForWhyUs(b.icon, b.title)}
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-2xl text-white mb-6 tracking-tight">{b.title}</h3>
                    <p className="font-display font-semibold text-sm text-primary uppercase tracking-widest">{b.subhead}</p>
                  </div>
                  
                  {(b.price || b.href) && (
                    <div className="ml-auto flex items-center gap-24">
                      {b.price && (
                        <div className="hidden md-flex flex-col items-end">
                          <span className="text-xs uppercase text-gray-4 tracking-wider mb-4">Starting at</span>
                          <span className="text-2xl font-extrabold text-white leading-none">{b.price}</span>
                        </div>
                      )}
                      {b.href && (
                        <Link href={b.href} className="btn btn-primary btn-md shrink-0">
                          Get Started
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  {renderBentoContent(b.desc)}
                </div>
              </div>
            ))}
          </div>
          
          {ctaLabel && (
            <div className="flex justify-center mt-64">
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
      <section className="section overflow-visible section-fade-bg">
        <div className="container">
          <div className="mb-64 max-w-720">
            {eyebrow && <p className="eyebrow mb-12">{eyebrow}</p>}
            <h2 className="font-display font-extrabold text-white mb-20 leading-tight tracking-tighter section-headline">
              {headline.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </h2>
            {desc && (
              <p className="text-gray-2 leading-loose text-base">
                {desc}
              </p>
            )}
          </div>

          <div className="flex flex-col premium-rows">
            {safe.map((b, i) => (
              <div 
                key={i} 
                id={getHashIdFromTitle(b.title)}
                className="premium-row sr relative items-center py-40 gap-40 scroll-mt-100"
              >
                {/* Column 1: Icon & Title & Desc */}
                <div className="flex items-start gap-20">
                  <div className="row-icon-container shrink-0 flex items-center justify-center rounded-xl text-primary p-12 icon-tile-48">
                    {getIconForWhyUs(b.icon, b.title)}
                  </div>
                  <div>
                    <h3 className="row-title font-display font-extrabold text-white mb-4 tracking-tight leading-tight text-xl">{b.title}</h3>
                    <p className="font-display font-semibold text-primary mb-10 uppercase tracking-widest text-xs">{b.subhead}</p>
                    {renderFormattedContent(b.desc)}
                  </div>
                </div>

                {/* Column 2: Features checklist */}
                <div className="premium-row__features-col">
                  {b.features && (
                    <ul className="flex flex-col gap-10 p-0 m-0 list-none">
                      {b.features.split(',').map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-10 text-gray-2">
                          <div className="shrink-0 flex items-center justify-center rounded check-chip">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span className="text-gray-2 text-135">{feat.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Column 3: Price & CTA button */}
                <div className="premium-row__cta-col flex flex-col items-end justify-center gap-16 h-full pl-32">
                  {b.price && (
                    <div className="flex flex-col items-end">
                      <span className="text-xs uppercase text-gray-3 tracking-widest mb-4">Starting at</span>
                      <span className="font-extrabold text-white leading-tight price-lg">{b.price}</span>
                    </div>
                  )}
                  {b.href && (
                    <Link href={b.href} className="btn btn-primary btn-md w-full justify-center text-center">
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (layout === 'grid') {
    return (
      <section className="section overflow-visible">
        <div className="container">
          <div className="text-center mb-64 max-w-720 mx-auto">
            {eyebrow && <p className="eyebrow justify-center mb-12">{eyebrow}</p>}
            <h2 className="font-display font-extrabold text-white mb-20 leading-tight tracking-tighter section-headline">
              {headline.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </h2>
            {desc && (
              <p className="text-gray-2 leading-loose text-base">
                {desc}
              </p>
            )}
          </div>

          <div className={`g wu-grid${ctaLabel ? ' mb-48' : ''}`}>
            {safe.map((b, i) => (
              <div 
                key={i} 
                id={getHashIdFromTitle(b.title)}
                className="sr card-hover flex flex-col gap-16 p-32 rounded-2xl relative bg-subtle-2 border-subtle scroll-mt-100 backdrop-blur-10" 
                style={{ animationDelay: `${i*0.08}s` }}
              >
                <div className="absolute inset-0 h-1 pointer-events-none card-topline" />
                
                <div className="shrink-0 flex items-center justify-center rounded-xl bg-soft text-primary p-12 icon-tile icon-tile-48">
                  {getIconForWhyUs(b.icon, b.title)}
                </div>
                
                <div className="flex flex-col grow-1">
                  <p className="font-display font-bold text-white mb-4 text-lg">{b.title}</p>
                  <p className="font-display font-semibold text-primary mb-10 uppercase tracking-wider text-sm">{b.subhead}</p>
                  {renderFormattedContent(b.desc)}
                  
                  {b.features && (
                    <ul className="flex flex-col gap-8 p-0 list-none text-sm my-16">
                      {b.features.split(',').map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-8 text-gray-2">
                          <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{feat.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {(b.price || b.href) && (
                    <div className="mt-auto pt-16 flex items-center justify-between gap-12 card-divider">
                      {b.price && (
                        <div className="flex flex-col">
                          <span className="text-xs uppercase text-gray-4 tracking-wider">Starting at</span>
                          <span className="font-extrabold text-white leading-none text-lg">{b.price}</span>
                        </div>
                      )}
                      {b.href && (
                        <Link href={b.href} className="btn btn-primary btn-sm">
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
            <div className="flex justify-center mt-40">
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
    <section className="section overflow-visible">
      <div className="container">
        <div className="g-2 items-start gap-80">
          <div className="sticky-mobile-fix lg:sticky sticky-88">
            <p className="eyebrow sr">{eyebrow}</p>
            <h2 className="sr font-display font-extrabold mb-20 leading-tight tracking-tighter section-headline-sm">
              {headline.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i === 1 ? (
                    <span className="text-grad">
                      {line}
                    </span>
                  ) : (
                    <>{line} </>
                  )}
                </React.Fragment>
              ))}
            </h2>
            
            {desc ? (
              <p className="text-gray-2 mb-32 leading-loose text-base">{desc}</p>
            ) : (
              <p className="text-gray-2 mb-32 leading-loose text-base">We combine world-class expertise with transparent pricing and a genuine commitment to your success. Not just code — business growth.</p>
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
          
          <div className="flex flex-col gap-16">
            {safe.map((b,i) => (
              <div key={i} id={getHashIdFromTitle(b.title)} className="sr card-hover flex gap-20 p-24 bg-subtle-2 border-subtle rounded-xl relative overflow-hidden scroll-mt-100" style={{ animationDelay:`${i*0.08}s` }}>
                <div className="shrink-0 flex items-center justify-center rounded-xl bg-soft text-primary p-12 icon-tile icon-tile-48">
                  {getIconForWhyUs(b.icon, b.title)}
                </div>
                <div className="flex flex-col grow-1">
                  <p className="font-display font-bold text-white mb-4 text-base">{b.title}</p>
                  <p className="font-display font-semibold text-primary mb-8 uppercase tracking-widest text-sm">{b.subhead}</p>
                  {renderFormattedContent(b.desc)}

                  {b.features && (
                    <ul className="flex flex-col gap-8 p-0 list-none text-sm my-16">
                      {b.features.split(',').map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-8 text-gray-2">
                          <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{feat.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {(b.price || b.href) && (
                    <div className="mt-auto pt-16 flex items-center justify-between gap-12 card-divider">
                      {b.price && (
                        <div className="flex flex-col">
                          <span className="text-xs uppercase text-gray-4 tracking-wider">Starting at</span>
                          <span className="font-extrabold text-white leading-none text-lg">{b.price}</span>
                        </div>
                      )}
                      {b.href && (
                        <Link href={b.href} className="btn btn-primary btn-sm">
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
