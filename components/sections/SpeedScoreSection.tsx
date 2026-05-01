'use client'
import React from 'react'

interface SpeedScoreSectionProps {
  title: string
  desc: string
  score: number
  metrics: { label: string; value: string }[]
  statusLabel?: string
}

const SpeedScoreSection = ({ title, desc, score = 99, metrics = [], statusLabel = 'CORE WEB VITALS PASS' }: SpeedScoreSectionProps) => {
  const safeMetrics = Array.isArray(metrics) ? metrics : []

  return (
    <section className="section" style={{ background: 'var(--bg)', padding: '100px 0' }}>
      <div className="container">
        <div className="tech-card" style={{ borderRadius: '32px', padding: '64px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'center' }} className="grid-md-1">
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: '40px', height: '4px', background: i === 3 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
              ))}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: '#fff', marginBottom: '24px', fontWeight: 900 }}>{title}</h3>
            <p style={{ color: 'var(--text-2)', fontSize: '17px', lineHeight: 1.8, marginBottom: '40px' }}>{desc}</p>
            
            <div style={{ display: 'flex', gap: '32px' }}>
              {safeMetrics.map(m => (
                <div key={m.label}>
                  <p style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase' }}>{m.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '48px', background: 'rgba(0,0,0,0.3)', borderRadius: '32px', border: '1px solid rgba(118,108,255,0.1)', position: 'relative' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <svg width="180" height="180" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="var(--primary)" 
                  strokeWidth="6" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * score) / 100}
                  style={{ transition: 'stroke-dashoffset 2s ease-out' }}
                />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</span>
                <p style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score</p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-2)', marginTop: '24px', fontWeight: 700 }}>Performance Rating</p>
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
               <div style={{ padding: '6px 12px', background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: '8px', fontSize: '11px', color: '#00e5a0', fontWeight: 700 }}>{statusLabel}</div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .grid-md-1 { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}

export default SpeedScoreSection
