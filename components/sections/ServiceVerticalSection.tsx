'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowSVG } from '@/components/ui/IconBox'

interface Feature {
  label: string
}

interface ServiceZigzagSectionProps {
  id?: string
  tagline: string
  title: string
  desc: string
  features: string | string[]
  price: string
  timeline: string
  visualType: 'score' | 'terminal' | 'vitals' | 'none'
  align: 'left' | 'right'
  statusText?: string // For terminal
  statusLabel?: string // For vitals/score
  score?: number
  metrics?: { label: string; value: string }[]
}

const F = { fontFamily: 'var(--font-display)' } as const
const M = { fontFamily: 'var(--font-mono)' } as const

export default function ServiceZigzagSection({
  id,
  tagline,
  title,
  desc,
  features = [],
  price,
  timeline,
  visualType = 'score',
  align = 'left',
  statusText = 'root@ariosetech:~/audit',
  statusLabel = 'Gutenberg Optimized',
  score = 99,
  metrics = []
}: ServiceZigzagSectionProps) {
  const safeFeatures = Array.isArray(features) ? features : (typeof features === 'string' ? features.split(',').map(f => f.trim()).filter(Boolean) : [])
  const safeMetrics = Array.isArray(metrics) ? metrics : []

  return (
    <section id={id} className="section" style={{ padding: '80px 0', background: 'transparent' }}>
      <div className="container">
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '40px', padding: 'clamp(32px, 8vw, 80px)', position: 'relative', overflow: 'hidden' }}>
          <div className="g-2" style={{ gap: '80px', alignItems: 'center', flexDirection: align === 'right' ? 'row-reverse' : 'row' }}>
            
            {/* Content Column */}
            <div className="sr">
              {visualType === 'vitals' && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
                  {[1, 2, 3].map(j => <div key={j} style={{ width: '40px', height: '2px', background: j === 3 ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }} />)}
                </div>
              )}
              <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '8px', background: visualType === 'terminal' ? 'rgba(255,50,100,0.08)' : 'rgba(118,108,255,0.08)', border: visualType === 'terminal' ? '1px solid rgba(255,50,100,0.2)' : '1px solid rgba(118,108,255,0.2)', marginBottom: '32px' }}>
                <span style={{ ...M, fontSize: '10px', color: visualType === 'terminal' ? '#ff3e60' : 'var(--primary)', textTransform: 'uppercase', fontWeight: 800 }}>{tagline}</span>
              </div>
              <h2 style={{ ...F, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '28px', color: '#fff' }}>{title}</h2>
              <p style={{ fontSize: '17px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '480px' }}>{desc}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px', marginBottom: '48px' }}>
                {safeFeatures.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff', fontWeight: 500 }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: visualType === 'terminal' ? '#ff3e60' : 'var(--primary)' }} />
                    {f}
                  </div>
                ))}
              </div>

              {/* Stats/Price/Timeline row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                {metrics.length > 0 ? (
                  <div style={{ display: 'flex', gap: '48px' }}>
                    {safeMetrics.map(m => (
                      <div key={m.label}>
                        <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{m.label}</p>
                        <p style={{ ...F, fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div>
                      <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Starting at</p>
                      <p style={{ ...F, fontSize: '32px', fontWeight: 900, color: '#fff' }}>{price}</p>
                    </div>
                    <div style={{ height: '40px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                    <div>
                      <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Execution</p>
                      <p style={{ ...F, fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>{timeline}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Visual Column */}
            <div className="sr" style={{ display: 'flex', justifyContent: 'center' }}>
              {visualType === 'score' && (
                <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '32px', padding: '64px 80px', textAlign: 'center', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', width: '100%', maxWidth: '440px' }}>
                  <div style={{ width: '180px', height: '180px', margin: '0 auto', position: 'relative' }}>
                    <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(118,108,255,0.1)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * score) / 100} strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ ...F, fontSize: '56px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</p>
                      <p style={{ ...M, fontSize: '11px', color: 'var(--primary)', fontWeight: 800, marginTop: '4px' }}>SCORE</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-2)', marginTop: '40px', fontWeight: 500 }}>Performance Rating</p>
                  <div style={{ marginTop: '24px', padding: '10px 20px', borderRadius: '12px', background: 'rgba(118,108,255,0.08)', border: '1px solid rgba(118,108,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                    <span style={{ ...M, fontSize: '10px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>{statusLabel}</span>
                  </div>
                </div>
              )}

              {visualType === 'terminal' && (
                <div style={{ position: 'relative', width: '100%' }}>
                  <div style={{ background: '#080810', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.5)' }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)', backgroundSize: '100% 3px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', opacity: 0.4 }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                      </div>
                      <p style={{ ...M, fontSize: '10px' }}>{statusText}</p>
                    </div>
                    <div style={{ ...M, fontSize: '14px', lineHeight: 2 }}>
                      <p style={{ color: '#00ffa3' }}>{'>'} INIT SCAN...</p>
                      <p style={{ color: '#00ffa3' }}>{'>'} CHECKING CORE FILES...</p>
                      <p style={{ color: '#ff3e60' }}>! ALERT: Vulnerability Detected</p>
                      <p style={{ color: '#00ffa3' }}>{'>'} PATCHING SECURITY LAYER...</p>
                      <p style={{ color: '#00ffa3' }}>{'>'} SYSTEM SECURE. MONITORING...</p>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#0a0a14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px 32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 2 }}>
                    <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Starting at</p>
                    <p style={{ ...F, fontSize: '32px', fontWeight: 900, color: '#fff' }}>{price}</p>
                  </div>
                </div>
              )}

              {visualType === 'vitals' && (
                <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '32px', padding: '48px', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', width: '100%', maxWidth: '440px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {[
                      { label: 'Cumulative Layout Shift', val: '0.01' },
                      { label: 'Largest Contentful Paint', val: '0.8s' },
                      { label: 'First Input Delay', val: '12ms' },
                      { label: 'Total Blocking Time', val: '40ms' },
                      { label: 'Speed Index', val: '0.9s' }
                    ].map(v => (
                      <div key={v.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{v.label}</span>
                          <span style={{ ...M, fontSize: '11px', color: 'var(--primary)', fontWeight: 800 }}>{v.val}</span>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: '95%', background: 'var(--grad)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 991px) {
          .g-2 { flex-direction: column !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}
