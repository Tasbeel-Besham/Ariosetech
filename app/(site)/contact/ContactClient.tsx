'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Mail, Phone, MapPin, Clock, MessageCircle } from '@/components/ui/Icons'
import ClutchWidget from '@/components/ui/ClutchWidget'
import InteractiveHeroSection from '@/components/sections/InteractiveHeroSection'

const F = { fontFamily: 'var(--font-display)' } as const
const M = { fontFamily: 'var(--font-mono)' } as const

const SERVICES = ['WordPress Development','WooCommerce Development','Shopify Development','Business Automation','Speed Optimization','Website Maintenance','Website Redesign','SEO Services','Other']
const BUDGETS  = ['Under $500','$500–$1,000','$1,000–$2,500','$2,500–$5,000','$5,000–$10,000','$10,000+']

// NOTE: These are defined at module scope on purpose. Defining components inside
// ContactClient makes React treat them as a new component type on every render,
// which unmounts and remounts the input on each keystroke and loses focus after
// one character. Keep them out here.
type FloatingInputProps = {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  multiline?: boolean
}

function FloatingInput({ label, type = 'text', value, onChange, required, multiline = false }: FloatingInputProps) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  return (
    <div className="fl-wrap">
      {multiline ? (
        <textarea
          value={value} onChange={e => onChange(e.target.value)} required={required}
          className={`fl-input fl-textarea${focused ? ' focused' : ''}`}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
          className={`fl-input fl-input-text${focused ? ' focused' : ''}`}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
      )}
      <label className={`fl-label${multiline ? ' fl-label-ta' : ''}${active ? ' active' : ''}`}>
        {label} {required && <span className="text-primary">*</span>}
      </label>
    </div>
  )
}

type FloatingSelectProps = {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}

function FloatingSelect({ label, value, onChange, options }: FloatingSelectProps) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const fn = () => setOpen(false)
    document.addEventListener('closeSelects', fn)
    return () => document.removeEventListener('closeSelects', fn)
  }, [])

  const active = open || value.length > 0
  return (
    <div className="fl-wrap" onClick={(e) => { e.stopPropagation(); document.dispatchEvent(new CustomEvent('closeSelects')); setOpen(!open) }}>
      <div className={`fl-input fl-select${open ? ' focused' : ''}`}>
        <span className={`fl-select-value text-15px${value ? '' : ' empty'}`}>
          {value || '-'}
        </span>
        <svg className={`fl-chevron${open ? ' open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      <label className={`fl-label${active ? ' active' : ''}`}>
        {label}
      </label>
      <div className={`fl-menu${open ? ' open' : ''}`}>
        {options.map((opt: string) => (
          <div key={opt} onClick={() => { onChange(opt); setOpen(false) }}
               className={`fl-option${value === opt ? ' selected' : ''}`}>
            {opt}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ContactClient() {
  const [form, setForm]       = useState({ name:'', email:'', phone:'', service:'', budget:'', message:'' })
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [hp, setHp]           = useState('')            // honeypot — must stay empty
  const [loadedAt] = useState(() => Date.now())          // form render time (bot-timing check)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, company_website: hp, formLoadedAt: loadedAt, source:'Contact Page', formName:'Contact Form', status:'new', createdAt: new Date().toISOString() }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        let detail = ''
        try { detail = (await res.json())?.error || '' } catch {}
        console.error('[contact] submit failed', res.status, detail)
        alert(`Something went wrong${detail ? ` (${detail})` : ''}. Please email info@ariosetech.com`)
      }
    } catch (err) {
      console.error('[contact] network error', err)
      alert('Network error. Please email info@ariosetech.com')
    }
    finally { setSending(false) }
  }

  // Close custom selects on outside click.
  useEffect(() => {
    const fn = () => document.dispatchEvent(new CustomEvent('closeSelects'))
    window.addEventListener('click', fn)
    return () => window.removeEventListener('click', fn)
  }, [])

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <InteractiveHeroSection
        eyebrow="Contact"
        headline="Start your project with a free quote"
        subheadline=""
        desc="Fill in the form below and we'll get back to you within 24 hours with a detailed quote and honest recommendations."
        ctaPrimaryLabel="Get Free Quote"
        ctaPrimaryHref="#quote"
        ctaSecondaryLabel="View Our Work"
        ctaSecondaryHref="/portfolio"
        liveSiteText="Available for new projects 🟢"
        codeFilename="ariosetech-inquiry / route.ts"
        codeLines={[
          [{ t: 'com', v: '// Process new project inquiry' }],
          [],
          [{ t: 'kw', v: 'export async function ' }, { t: 'fn', v: 'POST' }, { t: 'v', v: '(' }, { t: 'attr', v: 'req' }, { t: 'v', v: ') {' }],
          [{ t: 'v', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'inquiry' }, { t: 'v', v: ' = ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'attr', v: 'req' }, { t: 'v', v: '.' }, { t: 'fn', v: 'json' }, { t: 'v', v: '();' }],
          [{ t: 'v', v: '  ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'analyze_requirements' }, { t: 'v', v: '(' }, { t: 'attr', v: 'inquiry' }, { t: 'v', v: ');' }],
          [{ t: 'v', v: '  ' }, { t: 'kw', v: 'await' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'prepare_strategy' }, { t: 'v', v: '();' }],
          [{ t: 'v', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'v', v: ' ' }, { t: 'fn', v: 'Response' }, { t: 'v', v: '.' }, { t: 'fn', v: 'json' }, { t: 'v', v: '({ ' }, { t: 'attr', v: 'status' }, { t: 'v', v: ': ' }, { t: 'str', v: "'24h_reply_guaranteed'" }, { t: 'v', v: ' });' }],
          [{ t: 'v', v: '}' }]
        ]}
      />

      {/* ══ FORM + INFO ══════════════════════════════════════════════ */}
      <section className="section" id="quote">
        <div className="container">
          <div className="g-2 gap-72 items-start">

            {/* ── LEFT: info ──────────────────────────────────── */}
            <div>
              <h2 className="contact-headline">
                Let&apos;s Build Something<br />
                <span className="text-grad">Great Together</span>
              </h2>
              <p className="contact-lede">
                Tell us about your project. We&apos;ll reply within 24 hours with a free, no-obligation quote and an honest assessment.
              </p>

              {/* Contact cards */}
              <div className="flex flex-col gap-[14px] mb-32">
                {[
                  { Icon:Mail,          label:'Email',            value:'info@ariosetech.com',   href:'mailto:info@ariosetech.com',  note:'Proposals & project discussions' },
                  { Icon:Phone,         label:'Phone / WhatsApp', value:'+92 300 9484 739',       href:'tel:+923009484739',           note:'Quick questions, instant consultation' },
                  { Icon:MapPin,        label:'Office',           value:'Lahore, Pakistan',       href:undefined,                    note:'95 College Road, PCSIR Staff Colony' },
                  { Icon:Clock,         label:'Response Time',    value:'Within 24 Hours',        href:undefined,                    note:'No spam. No lock-in contracts.' },
                ].map(({ Icon, label, value, href, note }) => (
                  <div key={label} className="cc-card">
                    <div className="cc-icon">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="cc-label">{label}</p>
                      {href
                        ? <a href={href} className="cc-value cc-value-link">{value}</a>
                        : <p className="cc-value">{value}</p>}
                      <p className="cc-note">{note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp */}
              <a href="https://wa.me/923009484739?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project" target="_blank" rel="noopener noreferrer"
                className="wa-btn">
                <MessageCircle size={20} /> Chat on WhatsApp, Instant Reply
              </a>

              {/* Countries */}
              <div className="chip-box">
                <p className="chip-label">Clients we serve globally</p>
                <div className="flex flex-wrap gap-7">
                  {['🇺🇸 USA','🇦🇪 UAE','🇨🇭 Switzerland','🇬🇧 UK','🇦🇺 Australia','🇨🇦 Canada','🇩🇪 Germany','🇵🇰 Pakistan'].map(c => (
                    <span key={c} className="chip">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: form ─────────────────────────────────── */}
            <div className="quote-card lg:sticky lg:top-[88px]">
              {/* Header */}
              <div className="quote-head">
                <div className="flex items-center gap-12 mb-8">
                  <div className="quote-dot" />
                  <span className="quote-status">Accepting new projects</span>
                </div>
                <h3 className="quote-title">Request a Free Quote</h3>
                <p className="quote-sub">Reply within 24 hours · No commitment · No spam</p>
              </div>

              {sent ? (
                <div className="sent-box">
                  <div className="sent-icon">✓</div>
                  <p className="sent-title">Message Sent!</p>
                  <p className="sent-desc">We&apos;ll get back to you within 24 hours.<br/>Check your inbox, including spam.</p>
                </div>
              ) : (
                <form onSubmit={send} className="quote-form">
                  {/* Honeypot — positioned off-screen, hidden from real users but
                      filled by bots. aria-hidden + tabIndex keep it out of a11y flow. */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
                    <label htmlFor="company_website">Company website (leave blank)</label>
                    <input
                      id="company_website"
                      name="company_website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={hp}
                      onChange={e => setHp(e.target.value)}
                    />
                  </div>

                  <div className="g-2 gap-20">
                    <FloatingInput label="Full Name" value={form.name} onChange={(v:string) => set('name', v)} required />
                    <FloatingInput label="Email Address" type="email" value={form.email} onChange={(v:string) => set('email', v)} required />
                  </div>

                  <FloatingInput label="Phone / WhatsApp (optional)" value={form.phone} onChange={(v:string) => set('phone', v)} />

                  <div className="g-2 gap-20">
                    <FloatingSelect label="Service Needed" value={form.service} onChange={(v:string) => set('service', v)} options={SERVICES} />
                    <FloatingSelect label="Budget Range" value={form.budget} onChange={(v:string) => set('budget', v)} options={BUDGETS} />
                  </div>

                  <FloatingInput label="Project Details" value={form.message} onChange={(v:string) => set('message', v)} required multiline />

                  {/* Submit */}
                  <div className="flex flex-col gap-[14px] mt-10">
                    <button type="submit" disabled={sending} className="btn btn-primary btn-lg w-full justify-center">
                      {sending ? (
                        <>
                          <span className="btn-spin" />
                          Sending your message…
                        </>
                      ) : <>Send Message, Get Free Quote in 24h <ArrowRight size={17} /></>}
                    </button>
                    <p className="form-note">
                      🔒 Your information is 100% private. No spam. No lock-in contracts.
                    </p>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ══ STRATEGY SESSION ════════════════════════════════════════ */}
      <section className="section section--dark">
        <div className="container">
          <div className="g-2 gap-56 items-center">
          <div>
            <p className="eyebrow">Schedule a Call</p>
            <h2 className="strategy-headline">
              Book a Free Strategy Session
            </h2>
            <p className="strategy-lede">
              Prefer to talk? Book a free 30-minute strategy call with our team. We&apos;ll discuss your project, answer questions, and give honest recommendations, no sales pressure.
            </p>
            <div className="flex flex-wrap gap-10 mb-[28px]">
              {['30-minute call','Project advice & recommendations','Transparent pricing discussion','No obligation, no pressure'].map(t => (
                <span key={t} className="tag cta-badge">✓ {t}</span>
              ))}
            </div>
            <a href="#quote" className="btn btn-primary btn-lg">Schedule your free call <ArrowRight size={16} /></a>
          </div>
          <div className="glass-card">
            <p className="glass-label">Pick a time that works for you</p>
            <p className="glass-desc">
              Message us on WhatsApp to schedule a call at your convenience. We accommodate all time zones, USA, UAE, UK, and beyond.
            </p>
            <a href="https://wa.me/923009484739?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20strategy%20session" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-md w-full justify-center">
              Chat on WhatsApp to book
            </a>
          </div>
        </div>
      </div>
    </section>

      {/* ══ FAQ ══════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">FAQ</p>
          <h2 className="process-headline mb-40 text-white">Common Questions</h2>
          <div className="g-2 gap-16">
            {[
              { q:'How long does a website project take?',        a:'Most projects complete in 15–30 days. WordPress: 2–3 weeks. WooCommerce: 3–5 weeks. Shopify: 2–4 weeks. You receive a detailed timeline in every proposal.' },
              { q:'What is your pricing structure?',             a:'WordPress starts at $799, Shopify at $999, WooCommerce at $1,299. Fixed-price quotes, no hourly surprises. Typically 50% upfront, 50% on completion.' },
              { q:'Do you offer ongoing maintenance?',           a:'Yes. Monthly plans from $79/month covering updates, security monitoring, backups, and priority support.' },
              { q:'What is your money-back guarantee?',          a:'30-day money-back guarantee. If we fail to deliver what was agreed, you get a full refund, no questions asked.' },
              { q:'Do you work with clients in the USA & UAE?',  a:'Yes. Most clients are in the USA, UAE, and Switzerland. We schedule calls at your convenience and provide regular async updates.' },
              { q:'Can you work on my existing website?',        a:'Absolutely. Redesigns, speed optimizations, security fixes, migrations, and custom feature development for WordPress, WooCommerce, and Shopify.' },
            ].map(({ q, a }) => (
              <div key={q} className="qa-card">
                <p className="qa-q">{q}</p>
                <p className="qa-a">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════════ */}
      <section className="final-cta">
        <div className="container text-center">
          <p className="eyebrow justify-center">Ready to start?</p>
          <h2 className="final-cta-headline">
            Get a free quote in 24 hours.<br/>No commitment required.
          </h2>
          <div className="flex gap-[14px] justify-center flex-wrap mt-28">
            <Link href="/portfolio" className="btn btn-outline btn-xl">View Our Work</Link>
            <a href="#quote" className="btn btn-primary btn-xl">Get Free Quote <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>
    </>
  )
}
