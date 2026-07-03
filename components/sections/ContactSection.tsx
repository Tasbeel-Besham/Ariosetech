"use client";
import SectionHeader from '@/components/ui/SectionHeader'

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
  
  const cleanPhone = phone.replace(/[^0-9+]/g, '')
  
  return (
    <section className="section">
      <div className="container">
        <div className="mb-32">
          <SectionHeader
            eyebrow={eyebrow}
            headline={headline}
            desc={guarantee}
            center
            mb={0}
            headlineClass="font-display font-extrabold tracking-tighter leading-tight"
          />
        </div>
        
        <div className="g" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
          {[{ icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'Email', value: email, desc: emailDesc, href: `mailto:${email}` }, 
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: 'Phone/WhatsApp', value: phone, desc: phoneDesc, href: `tel:${cleanPhone}` }, 
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: 'Address', value: address, desc: addressDesc, href: undefined }].map(({ icon, label, value, desc, href }) => (
            <div key={label} className="card-hover bg-subtle-2 border-subtle p-40 text-center flex flex-col items-center justify-center relative overflow-hidden" style={{ borderRadius: '16px' }}>
              <div className="absolute top-0 left-0 w-full bg-grad" style={{ height: '3px' }} />
              <div className="mb-16 flex items-center justify-center">{icon}</div>
              <p className="font-mono font-bold text-primary mb-12 uppercase tracking-widest text-xs">{label}</p>
              {href ? <a href={href} className="font-display font-semibold text-white block no-underline text-base">{value}</a> : <p className="font-display font-semibold text-white leading-relaxed text-base">{value}</p>}
              {desc && <p className="text-gray-3 leading-relaxed mt-8 text-sm">{desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
