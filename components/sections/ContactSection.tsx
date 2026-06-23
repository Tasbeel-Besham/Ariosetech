"use client";
type Props = { 
  eyebrow?: string; 
  headline?: string; 
  guarantee?: string; 
  email?: string; 
  emailDesc?: string;
  phone?: string; 
  phoneDesc?: string;
  address?: string;
  addressDesc?: string;
}

export default function ContactSection({ 
  eyebrow='Get In Touch', 
  headline='Ready to Transform Your Online Presence?', 
  guarantee='We respond to all inquiries within 2 hours during business days.',
  email='info@ariosetech.com',
  emailDesc='',
  phone='+92 300 9484 739',
  phoneDesc='',
  address='95 College Road, Lahore',
  addressDesc=''
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
          {[{ icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'Email', value: email, desc: emailDesc, href: `mailto:${email}` }, 
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: 'Phone/WhatsApp', value: phone, desc: phoneDesc, href: `tel:${cleanPhone}` }, 
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: 'Address', value: address, desc: addressDesc, href: undefined }].map(({ icon, label, value, desc, href }) => (
            <div key={label} className="card-hover" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'var(--grad)' }} />
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
              <p style={{ ...M, fontSize: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px', fontWeight: 700 }}>{label}</p>
              {href ? <a href={href} style={{ ...F, fontSize: '15px', fontWeight: 600, color: '#fff', display: 'block', textDecoration: 'none' }}>{value}</a> : <p style={{ ...F, fontSize: '15px', fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>{value}</p>}
              {desc && <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '8px', lineHeight: 1.4 }}>{desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
