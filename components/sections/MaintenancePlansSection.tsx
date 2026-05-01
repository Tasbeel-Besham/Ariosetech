'use client'
import React from 'react'
import { IconBox, CheckSVG } from '@/components/ui/IconBox'
import Link from 'next/link'

interface Plan {
  tier: string
  price: string
  desc?: string
  features: string[]
}

interface MaintenancePlansSectionProps {
  title: string
  subtitle: string
  plans: Plan[]
}

const MaintenancePlansSection = ({ title, subtitle, plans }: MaintenancePlansSectionProps) => {
  const safePlans = Array.isArray(plans) ? plans : []

  return (
    <section className="section" style={{ background: 'var(--bg)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: '#fff', marginBottom: '16px', fontWeight: 900 }}>{title}</h3>
          <p style={{ color: 'var(--text-3)', fontSize: '15px' }}>{subtitle}</p>
        </div>
        
        <div className="g-3">
          {safePlans.map((plan, i) => (
            <div key={plan.tier} className="tech-card shimmer-border" style={{ padding: '40px', borderRadius: '24px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {i === 1 && (
                <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--grad)', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 800 }}>
                  MOST POPULAR
                </div>
              )}
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--primary)', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>{plan.tier}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', fontWeight: 900, marginBottom: '16px' }}>{plan.price}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '32px' }}>{plan.desc || 'Optimized performance and security'}</p>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px', flex: 1 }}>
                {(Array.isArray(plan.features) ? plan.features : (typeof plan.features === 'string' ? (plan.features as string).split(',').map(f => f.trim()).filter(Boolean) : [])).map(f => (
                  <li key={f} style={{ fontSize: '14px', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconBox size={18} radius={4} style={{ border: 'none', background: 'rgba(118,108,255,0.1)' }}>
                      <CheckSVG size={8} />
                    </IconBox>
                    {f}
                  </li>
                ))}
              </ul>
              
              <Link href="/contact" className={`btn ${i === 1 ? 'btn-primary' : 'btn-outline'} btn-lg`} style={{ width: '100%', justifyContent: 'center', borderRadius: '12px' }}>
                Subscribe Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MaintenancePlansSection
