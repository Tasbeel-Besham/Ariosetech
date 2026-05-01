import Link from 'next/link'

import { IconBox, CheckSVG, ArrowSVG } from '@/components/ui/IconBox'

type Props = {
  eyebrow?: string; headline?: string; subheadline?: string; supportingText?: string
  ctaPrimaryLabel?: string; ctaPrimaryHref?: string
  ctaSecondaryLabel?: string; ctaSecondaryHref?: string
  trust?: string
}

export default function HeroSection({
  eyebrow = 'Available for new projects',
  headline = 'Professional WordPress, Shopify & WooCommerce Development Since 2017',
  subheadline = 'Transform your business with custom e-commerce solutions that drive results.',
  supportingText = 'Trusted by businesses in the USA, UAE, and Switzerland.',
  ctaPrimaryLabel = 'Get Free Quote & Strategy Call',
  ctaPrimaryHref = '/contact',
  ctaSecondaryLabel = 'View Our Portfolio',
  ctaSecondaryHref = '/portfolio',
  trust = '',
}: Props) {
  const trustItems = trust ? trust.split(',').map(s => s.trim()).filter(Boolean) : []

  return (
    <section style={{
      minHeight: '82vh', display: 'flex', alignItems: 'center',
      borderBottom: '1px solid var(--border)', position: 'relative',
      overflow: 'hidden', padding: 'clamp(60px,8vw,96px) 0 clamp(48px,6vw,80px)',
    }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '65%', height: '75%', background: 'radial-gradient(ellipse, rgba(118,108,255,0.14) 0%, transparent 65%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '55%', height: '65%', background: 'radial-gradient(ellipse, rgba(118,108,255,0.07) 0%, transparent 65%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '860px' }}>

        {/* Available badge */}
        {eyebrow && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px 5px 8px', borderRadius: '100px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.25)', marginBottom: '28px' }}>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--primary)', opacity: 0.4, animation: 'blink 2s ease-in-out infinite' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)', display: 'block', position: 'relative' }} />
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              {eyebrow}
            </span>
          </div>
        )}

        {/* H1 */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#f0f0ff', marginBottom: '20px' }}>
          {headline.includes('WooCommerce') ? (
            <>
              Professional WordPress, Shopify &{' '}
              <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                WooCommerce Development
              </span>{' '}Since 2017
            </>
          ) : headline}
        </h1>

        {/* Subheadline */}
        <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--text-2)', lineHeight: 1.75, maxWidth: '640px', marginBottom: supportingText ? '10px' : '28px' }}>
          {subheadline}
        </p>

        {/* Supporting */}
        {supportingText && (
          <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.7, maxWidth: '540px', marginBottom: '32px' }}>
            {supportingText}
          </p>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
          <Link href={ctaPrimaryHref} className="btn btn-primary btn-xl">
            {ctaPrimaryLabel} <ArrowSVG size={17} />
          </Link>
          {ctaSecondaryLabel && (
            <Link href={ctaSecondaryHref} className="btn btn-outline btn-xl">
              {ctaSecondaryLabel}
            </Link>
          )}
        </div>

        {/* Trust badges */}
        {trustItems.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: '8px 28px', width: 'fit-content' }}>
            {trustItems.map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconBox size={22} radius={6}>
                  <CheckSVG size={10} />
                </IconBox>
                <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{t}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
