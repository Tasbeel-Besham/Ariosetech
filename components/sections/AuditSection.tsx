"use client";
import Link from 'next/link'
import { IconBox, CheckSVG, ArrowSVG } from '@/components/ui/IconBox'
import SectionHeading from '@/components/ui/SectionHeading'

type CheckItem = { value: string }
type Props = {
  headingTag?: string;
  eyebrow?: string; headline?: string; subheadline?: string; subhead?: string; desc?: string; note?: string; guarantee?: string; ctaLabel?: string; ctaHref?: string; items?: CheckItem[] }

const DEFAULT_ITEMS = ['Performance bottleneck analysis','SEO issues & keyword opportunities','Conversion barrier identification','Security vulnerability check','Mobile experience assessment','Detailed action plan, no obligation']

export default function AuditSection({ headingTag='h2', eyebrow='Free Audit', headline='Get Your Free Website Performance Audit', subheadline, subhead, desc="Find out exactly how to improve your site's speed, SEO, security, and conversion rates with our comprehensive 25-point website audit.", note, guarantee, ctaLabel='Get My Free Audit Report', ctaHref='/contact', items=[] }: Props) {
  const F = { fontFamily:'var(--font-display)' } as const
  const M = { fontFamily:'var(--font-mono)' } as const
  const sub = subheadline || subhead || "Discover what's holding your website back from peak performance."
  const noteText = note || guarantee || 'No spam, ever. Detailed report delivered within 24 hours.'
  const checks = items.length ? items.map(i=>i.value).filter(Boolean) : DEFAULT_ITEMS
  return (
    <section className="section">
      <div className="container">
        <div className="audit-card">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <SectionHeading as={headingTag} className="audit-headline">{headline}</SectionHeading>
            <p className="audit-sub">{sub}</p>
            <p className="audit-desc">{desc}</p>
            <p className="audit-note">{noteText}</p>
          </div>
          <div className="flex flex-col gap-16">
            {checks.map(item => (
              <div key={item} className="flex items-center gap-16">
                <IconBox size={32} radius={10}>
                  <CheckSVG size={14} />
                </IconBox>
                <span className="audit-check-text">{item}</span>
              </div>
            ))}
            <Link href={ctaHref} className="btn btn-primary btn-lg audit-cta">
              {ctaLabel}
              <ArrowSVG />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
