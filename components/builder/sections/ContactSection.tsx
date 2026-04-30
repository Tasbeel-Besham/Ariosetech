type Props = { eyebrow?: string; headline?: string; guarantee?: string; email?: string; phone?: string; address?: string }
export default function ContactSection({ 
  eyebrow='Get In Touch', 
  headline='Ready to Transform Your Online Presence?', 
  guarantee='We respond to all inquiries within 2 hours during business days.',
  email='info@ariosetech.com',
  phone='+92 300 9484 739',
  address='95 College Road, Lahore'
}: Props) {
  const F = { fontFamily: 'var(--font-display)' } as const
  const M = { fontFamily: 'var(--font-mono)' } as const
  
  const cleanPhone = phone.replace(/[^0-9+]/g, '')
  
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
          <h2 style={{ ...F, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff', marginBottom: '10px' }}>{headline}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>{guarantee}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
          {[{ icon: '📧', label: 'Email', value: email, href: `mailto:${email}` }, 
            { icon: '📱', label: 'Phone/WhatsApp', value: phone, href: `tel:${cleanPhone}` }, 
            { icon: '🏢', label: 'Address', value: address, href: undefined }].map(({ icon, label, value, href }) => (
            <div key={label} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</p>
              <p style={{ ...M, fontSize: '9px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{label}</p>
              {href ? <a href={href} style={{ ...F, fontSize: '14px', fontWeight: 600, color: '#fff', display: 'block', textDecoration: 'none' }}>{value}</a> : <p style={{ ...F, fontSize: '14px', fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>{value}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
