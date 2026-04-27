type Props = { eyebrow?: string; headline?: string; guarantee?: string }
export default function ContactSection({ eyebrow='Get In Touch', headline='Ready to Transform Your Online Presence?', guarantee='We respond to all inquiries within 2 hours during business days.' }: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
          <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff', marginBottom: '10px' }}>{headline}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>{guarantee}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
          {[{ icon: '📧', label: 'Email', value: 'info@ariosetech.com', href: 'mailto:info@ariosetech.com' }, { icon: '📱', label: 'Phone/WhatsApp', value: '+92 300 9484 739', href: 'tel:+923009484739' }, { icon: '🏢', label: 'Address', value: '95 College Road, Lahore', href: undefined }].map(({ icon, label, value, href }) => (
            <div key={label} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</p>
              <p style={{ ...M, fontSize: '9px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{label}</p>
              {href ? <a href={href} style={{ ...F, fontSize: '13px', fontWeight: 600, color: '#fff', display: 'block' }}>{value}</a> : <p style={{ ...F, fontSize: '13px', fontWeight: 600, color: '#fff' }}>{value}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
