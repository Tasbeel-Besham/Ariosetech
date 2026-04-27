'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import ClutchWidget from '@/components/ui/ClutchWidget'

const F = { fontFamily: 'var(--font-display)' } as const
const M = { fontFamily: 'var(--font-mono)' } as const

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', budget: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          budget: form.budget,
          message: form.message,
          source: 'Contact Page',
          formName: 'Contact Form',
          status: 'new',
          createdAt: new Date().toISOString(),
        }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        alert('Something went wrong. Please email us directly at info@ariosetech.com')
      }
    } catch {
      alert('Network error. Please email us directly at info@ariosetech.com')
    } finally {
      setSending(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)', padding: '12px 16px', fontSize: '14px',
    color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-body)',
    transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase',
    letterSpacing: '0.1em', display: 'block', marginBottom: '7px',
  }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = 'rgba(79,110,247,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,110,247,0.1)' }
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ paddingTop: '100px', paddingBottom: '72px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 20% 60%, rgba(79,110,247,0.09) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow">Contact</p>
          <h1 style={{ ...F, fontSize: 'clamp(2.6rem,5vw,4.2rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '18px', maxWidth: '700px' }}>
            Start your project<br />
            <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              with a free quote
            </span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: '540px', marginBottom: '18px' }}>
            Fill in the form below and we&apos;ll get back to you within 24 hours with a free quote and honest advice.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '22px' }}>
            {['30-Day Guarantee', 'No Contracts', '24h Reply', 'Free Quote'].map(t => (
              <span key={t} className="tag" style={{ color: 'var(--text-2)', border: '1px solid var(--border-2)' }}>✓ {t}</span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/portfolio" className="btn btn-outline btn-lg">View Work</Link>
            <a href="#quote" className="btn btn-primary btn-lg">Get Free Quote <ArrowRight size={16} /></a>
          </div>

          <div style={{ marginTop: '26px', maxWidth: '760px' }}>
            <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '10px' }}>
              Verified on Clutch
            </p>
            <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(10,10,18,0.6)' }}>
              <ClutchWidget widgetType={7} height={70} />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.7, marginTop: '10px' }}>
              Every review independently verified by a Clutch analyst through a client interview process.
            </p>
          </div>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--border)' }} id="quote">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '64px', alignItems: 'start' }}>

            {/* Left: contact info */}
            <div>
              <h2 style={{ ...F, fontSize: 'clamp(1.6rem,2.6vw,2.2rem)', fontWeight: 800, color: '#fff', marginBottom: '10px', letterSpacing: '-0.03em' }}>
                Let&apos;s Build Something<br />
                <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Great Together
                </span>
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '26px', maxWidth: '520px' }}>
                Tell us about your project and get a free quote within 24 hours. No commitment — just an honest conversation.
              </p>

              {/* Info cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
                {[
                  { Icon: Mail,   label: 'Email',         value: 'info@ariosetech.com',    href: 'mailto:info@ariosetech.com',  note: 'Proposals & project discussions' },
                  { Icon: Phone,  label: 'Phone / WhatsApp', value: '+92 300 9484 739',    href: 'tel:+923009484739',           note: 'Quick questions, instant consultation' },
                  { Icon: MapPin, label: 'Office',         value: 'Lahore, Pakistan',      href: undefined,                     note: '95 College Road, PCSIR Staff Colony' },
                  { Icon: Clock,  label: 'Reply time',  value: 'Reply within 24 hours',        href: undefined,                     note: 'No spam. No lock-in.' },
                ].map(({ Icon, label, value, href, note }) => (
                  <div key={label} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '18px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '14px', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-2)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} style={{ color: 'var(--blue)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ ...M, fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>{label}</p>
                      {href
                        ? <a href={href} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '2px', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--blue)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}>{value}</a>
                        : <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>{value}</p>}
                      <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>{note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a href="https://wa.me/923009484739?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', borderRadius: '14px', textDecoration: 'none', background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '20px', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <MessageCircle size={18} /> Chat on WhatsApp — Instant Reply
              </a>

              {/* Countries */}
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
                <p style={{ ...M, fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Clients we serve</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['🇺🇸 USA', '🇦🇪 UAE', '🇨🇭 Switzerland', '🇬🇧 UK', '🇦🇺 Australia', '🇨🇦 Canada', '🇩🇪 Germany', '🇵🇰 Pakistan'].map(c => (
                    <span key={c} style={{ fontSize: '12px', color: 'var(--text-2)', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '8px' }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', position: 'sticky', top: '88px' }}>
              <div style={{ padding: '24px 26px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, rgba(79,110,247,0.07), rgba(155,109,255,0.05))' }}>
                <h3 style={{ ...F, fontSize: '17px', fontWeight: 800, color: 'var(--text)', marginBottom: '3px' }}>Free Project Quote</h3>
                <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)' }}>Reply within 24 hours · No commitment</p>
              </div>

              {sent ? (
                <div style={{ padding: '48px 26px', textAlign: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>✓</div>
                  <p style={{ ...F, fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Message sent!</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.7 }}>We&apos;ll get back to you within 24 hours. Check your inbox.</p>
                </div>
              ) : (
                <form onSubmit={send} style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={lbl}>Name *</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Smith" required style={inp} onFocus={focus} onBlur={blur} />
                    </div>
                    <div>
                      <label style={lbl}>Email *</label>
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@co.com" required style={inp} onFocus={focus} onBlur={blur} />
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Phone / WhatsApp</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 234 567 8900" style={inp} onFocus={focus} onBlur={blur} />
                  </div>
                  <div>
                    <label style={lbl}>Service</label>
                    <select value={form.service} onChange={e => set('service', e.target.value)} style={{ ...inp, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                      <option value="">Select a service…</option>
                      {['WordPress Development', 'WooCommerce Development', 'Shopify Development', 'Speed Optimization', 'Website Maintenance', 'Website Redesign', 'SEO Services', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Budget</label>
                    <select value={form.budget} onChange={e => set('budget', e.target.value)} style={{ ...inp, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                      <option value="">Select a range…</option>
                      {['$500–$1,000', '$1,000–$2,500', '$2,500–$5,000', '$5,000–$10,000', '$10,000+'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Message *</label>
                    <textarea value={form.message} onChange={e => set('message', e.target.value)} required rows={4} placeholder="Tell us about your project…" style={{ ...inp, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
                  </div>
                  <button type="submit" disabled={sending} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
                    {sending ? (
                      <>
                        <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        Sending…
                      </>
                    ) : <>Send Message — Free Quote in 24h <ArrowRight size={16} /></>}
                  </button>
                  <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textAlign: 'center' }}>
                    🔒 Your info is private. No spam. No lock-in contracts.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Strategy session ── */}
      <section style={{ padding: '90px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <p className="eyebrow">Schedule a Call</p>
            <h2 style={{ ...F, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '16px', color: '#fff' }}>
              Book a Free Strategy Session
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.9, maxWidth: '560px', marginBottom: '18px' }}>
              Prefer to talk? Book a free 30-minute strategy call with our team. We&apos;ll discuss your project, answer questions, and give honest recommendations — no sales pressure.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {['30-minute call', 'Project advice & recommendations', 'Transparent pricing discussion', 'No obligation, no pressure'].map(t => (
                <span key={t} className="tag" style={{ color: 'var(--text-2)', border: '1px solid var(--border-2)' }}>✓ {t}</span>
              ))}
            </div>
            <a href="#quote" className="btn btn-primary btn-lg">Schedule your free call <ArrowRight size={16} /></a>
          </div>
          <div style={{ background: 'rgba(10,10,18,0.7)', border: '1px solid rgba(118,108,255,0.18)', borderRadius: '24px', padding: '34px', backdropFilter: 'blur(20px)' }}>
            <p style={{ ...M, fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 800, marginBottom: '12px' }}>Pick a time that works for you</p>
            <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '18px' }}>
              (If you want the exact same booking calendar as the live site, tell me what link/tool you use — Calendly, TidyCal, Google Calendar, etc. — and I&apos;ll embed it here.)
            </p>
            <a href="https://wa.me/923009484739?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20strategy%20session" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-md" style={{ width: '100%', justifyContent: 'center' }}>
              Chat on WhatsApp to book
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '90px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <p className="eyebrow">FAQ</p>
          <h2 style={{ ...F, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '28px', color: '#fff' }}>
            Common questions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {[
              { q: 'How long does a website project take?', a: 'Most projects are completed in 15–30 days depending on scope. WordPress: 2–3 weeks. WooCommerce: 3–5 weeks. Shopify: 2–4 weeks. You receive a detailed timeline in every proposal.' },
              { q: 'What is your pricing structure?', a: 'WordPress development starts at $799, Shopify at $999, and WooCommerce at $1,299. We provide fixed-price quotes with no hourly surprises. Payment is typically 50% upfront and 50% on completion.' },
              { q: 'Do you offer ongoing maintenance?', a: 'Yes. Monthly maintenance plans start at $79/month covering updates, security monitoring, backups, and priority support.' },
              { q: 'What is your money-back guarantee?', a: 'We offer a 30-day money-back guarantee. If we fail to deliver what was agreed in the proposal, you get a full refund — no questions asked.' },
              { q: 'Do you work with clients in the USA and UAE?', a: 'Yes. Most of our clients are in the USA, UAE, and Switzerland. We schedule calls at your convenience and provide regular async updates.' },
              { q: 'Can you work on my existing website?', a: 'Absolutely. We handle redesigns, speed optimizations, security fixes, migrations, and custom feature development for WordPress, WooCommerce, and Shopify.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
                <p style={{ ...F, fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{q}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.85 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '100px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Ready to start your project?</p>
          <h2 style={{ ...F, fontSize: 'clamp(2.2rem,4.2vw,3.4rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginBottom: '14px' }}>
            Get a free quote in 24 hours.<br />No commitment required.
          </h2>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '22px' }}>
            <Link href="/portfolio" className="btn btn-outline btn-xl">View Work</Link>
            <a href="#quote" className="btn btn-primary btn-xl">Get Free Quote <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>
    </>
  )
}
