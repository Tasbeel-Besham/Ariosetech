'use client'
import React from 'react'
import { IconBox, ArrowSVG } from '@/components/ui/IconBox'
import Link from 'next/link'

interface CyberTerminalSectionProps {
  title: string
  desc: string
  features: string[]
  price: string
  tagline: string
  statusText?: string
}

const CyberTerminalSection: React.FC<{ props: CyberTerminalSectionProps }> = ({ props }) => {
  const { title, desc, features, price, tagline, statusText = 'root@ariosetech:~/malware_scanner' } = props

  return (
    <section className="section" style={{ background: 'var(--bg)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ background: '#08080c', border: '1px solid #1a1a25', borderRadius: '32px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: '#12121a', borderBottom: '1px solid #1a1a25', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4d6d' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5a0' }} />
            <span style={{ fontSize: '10px', color: '#55557a', fontFamily: 'var(--font-mono)', marginLeft: '12px' }}>{statusText}</span>
          </div>

          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }} className="grid-md-1">
            <div>
              <div style={{ display: 'inline-flex', padding: '4px 12px', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '4px', marginBottom: '24px' }}>
                <span style={{ fontSize: '10px', color: '#ff4d6d', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{tagline || 'EMERGENCY RESPONSE'}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: '#fff', marginBottom: '24px', fontWeight: 900 }}>{title}</h3>
              <p style={{ color: '#7a7a9a', fontSize: '16px', lineHeight: 1.8, marginBottom: '40px' }}>{desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {(features || []).map(f => (
                  <li key={f} style={{ fontSize: '13px', color: '#b0b0cc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '4px', height: '4px', background: '#ff4d6d', borderRadius: '50%' }} /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ background: '#0a0a0f', border: '1px solid #1a1a25', borderRadius: '20px', padding: '32px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#00e5a0', height: '280px', overflow: 'hidden' }}>
                <div style={{ animation: 'scan 8s infinite linear' }}>
                  <p>&gt; INIT SCAN...</p>
                  <p>&gt; CHECKING /wp-content/plugins...</p>
                  <p style={{ color: '#ff4d6d' }}>! ALERT: Trojan.Generic FOUND</p>
                  <p>&gt; ISOLATING THREAT...</p>
                  <p>&gt; DECRYPTING PAYLOAD...</p>
                  <p>&gt; REMOVING INJECTED SQL...</p>
                  <p style={{ color: '#00e5a0' }}>&gt; SYSTEM CLEAN. REBOOTING...</p>
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,229,160,0.02) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', padding: '24px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <p style={{ fontSize: '10px', color: '#7a7a9a', textTransform: 'uppercase' }}>Starting At</p>
                <p style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>{price}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @media (max-width: 768px) {
          .grid-md-1 { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}

export default CyberTerminalSection
