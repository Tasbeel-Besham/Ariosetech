'use client'
import React from 'react'
import { StandardCheck } from '@/components/ui/IconBox'
import Link from 'next/link'

interface Plan {
  tier: string
  price: string
  desc?: string
  features: string | string[]
  ctaLabel?: string
  ctaHref?: string
  isPopular?: boolean
}

interface MaintenancePlansSectionProps {
  title: string
  subtitle: string
  plans: Plan[]
}

const F = { fontFamily: 'var(--font-display)' } as const
const M = { fontFamily: 'var(--font-mono)' } as const
const P = { background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } as const

const MaintenancePlansSection = ({ title = "Maintenance Plans", subtitle = "Managed Hosting & Support", plans = [] }: MaintenancePlansSectionProps) => {
  const safePlans = Array.isArray(plans) ? plans : []

  return (
    <section className="section" style={{ padding: '120px 0', background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{subtitle}</p>
          <h2 style={{ ...F, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800 }}>
            {title.includes('Maintenance') ? (
              <>Maintenance <span style={P}>Plans</span></>
            ) : title}
          </h2>
        </div>
        
        <div className="g-3" style={{ gap: '24px' }}>
          {safePlans.map((plan, i) => {
            const isPopular = plan.isPopular
            const featuresArr = Array.isArray(plan.features) ? plan.features : (typeof plan.features === 'string' ? plan.features.split(',').map(f => f.trim()).filter(Boolean) : [])
            
            return (
              <div key={plan.tier + i} className="sr" style={{ 
                padding: '48px 32px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '32px', 
                position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: isPopular ? '0 30px 60px rgba(118,108,255,0.15)' : 'none',
                transform: isPopular ? 'scale(1.02)' : 'scale(1)',
                zIndex: isPopular ? 2 : 1
              }}>
                {isPopular && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', padding: '4px 12px', borderRadius: '100px', background: 'var(--grad)', fontSize: '10px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ ...F, fontSize: '24px', marginBottom: '8px', color: '#fff' }}>{plan.tier}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '32px' }}>{plan.desc}</p>
                <p style={{ ...F, fontSize: '40px', fontWeight: 900, marginBottom: '32px', color: '#fff' }}>{plan.price}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', flex: 1 }}>
                  {featuresArr.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                      <StandardCheck size={16} />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href={plan.ctaHref || '/contact'} className={`btn ${isPopular ? 'btn-primary' : 'btn-outline'} btn-lg`} style={{ width: '100%', justifyContent: 'center' }}>
                  {plan.ctaLabel || 'Get Started'}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MaintenancePlansSection
