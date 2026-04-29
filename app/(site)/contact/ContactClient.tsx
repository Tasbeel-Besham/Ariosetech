'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Mail, Phone, MapPin, Clock, MessageCircle } from '@/components/ui/Icons'
import ClutchWidget from '@/components/ui/ClutchWidget'

const F = { fontFamily: 'var(--font-display)' } as const
const M = { fontFamily: 'var(--font-mono)' } as const

const SERVICES = ['WordPress Development','WooCommerce Development','Shopify Development','Speed Optimization','Website Maintenance','Website Redesign','SEO Services','Other']
const BUDGETS  = ['Under $500','$500–$1,000','$1,000–$2,500','$2,500–$5,000','$5,000–$10,000','$10,000+']

export default function ContactClient() {
  const [form, setForm]       = useState({ name:'', email:'', phone:'', service:'', budget:'', message:'' })
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source:'Contact Page', formName:'Contact Form', status:'new', createdAt: new Date().toISOString() }),
      })
      if (res.ok) setSent(true)
      else alert('Something went wrong. Please email info@ariosetech.com')
    } catch { alert('Network error. Please email info@ariosetech.com') }
    finally { setSending(false) }
  }

  const inpShared = {
    width:'100%', background:'rgba(255,255,255,0.03)',
    border:'1px solid var(--border)', borderRadius:'12px',
    fontSize:'15px', color:'var(--text)',
    outline:'none', fontFamily:'var(--font-body)',
    transition:'border-color 0.2s, box-shadow 0.2s, background 0.2s',
    boxSizing:'border-box' as const,
  }

  const FloatingInput = ({ label, type='text', value, onChange, required, multiline=false }: any) => {
    const [focused, setFocused] = useState(false)
    const active = focused || value.length > 0
    
    return (
      <div style={{ position:'relative', width:'100%' }}>
        {multiline ? (
          <textarea
            value={value} onChange={e => onChange(e.target.value)} required={required}
            style={{
              ...inpShared,
              padding: '24px 20px 16px', minHeight: '140px', resize: 'vertical',
              borderColor: focused ? 'rgba(118,108,255,0.55)' : 'var(--border)',
              boxShadow: focused ? '0 0 0 4px rgba(118,108,255,0.10)' : 'none',
              background: focused ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)'
            }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          />
        ) : (
          <input
            type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
            style={{
              ...inpShared,
              padding: '22px 20px 10px', height: '56px',
              borderColor: focused ? 'rgba(118,108,255,0.55)' : 'var(--border)',
              boxShadow: focused ? '0 0 0 4px rgba(118,108,255,0.10)' : 'none',
              background: focused ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)'
            }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          />
        )}
        <label style={{
          position:'absolute', left:'20px',
          top: active ? (multiline ? '14px' : '10px') : (multiline ? '22px' : '50%'),
          transform: active ? 'none' : 'translateY(-50%)',
          fontSize: active ? '10px' : '15px',
          color: active ? 'var(--primary)' : 'var(--text-3)',
          fontFamily: active ? 'var(--font-mono)' : 'var(--font-body)',
          textTransform: active ? 'uppercase' : 'none',
          letterSpacing: active ? '0.1em' : 'normal',
          fontWeight: active ? 700 : 400,
          transition:'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents:'none'
        }}>
          {label} {required && <span style={{color:'var(--primary)'}}>*</span>}
        </label>
      </div>
    )
  }

  const FloatingSelect = ({ label, value, onChange, options }: any) => {
    const [open, setOpen] = useState(false)
    const active = open || value.length > 0
    return (
      <div style={{ position:'relative', width:'100%' }} onClick={(e) => { e.stopPropagation(); setOpen(!open) }}>
        {/* Fake input for UI */}
        <div style={{
          ...inpShared,
          padding: '22px 40px 10px 20px', height: '56px', cursor: 'pointer',
          display: 'flex', alignItems: 'flex-end', userSelect: 'none',
          borderColor: open ? 'rgba(118,108,255,0.55)' : 'var(--border)',
          boxShadow: open ? '0 0 0 4px rgba(118,108,255,0.10)' : 'none',
          background: open ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)'
        }}>
          <span style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: value ? 'var(--text)' : 'transparent' }}>
            {value || '-'}
          </span>
          <svg style={{ position: 'absolute', right: '16px', top: '50%', transform: `translateY(-50%) rotate(${open ? '180deg' : '0'})`, transition: 'transform 0.2s', color: 'var(--text-3)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <label style={{
          position:'absolute', left:'20px',
          top: active ? '10px' : '50%',
          transform: active ? 'none' : 'translateY(-50%)',
          fontSize: active ? '10px' : '15px',
          color: active ? 'var(--primary)' : 'var(--text-3)',
          fontFamily: active ? 'var(--font-mono)' : 'var(--font-body)',
          textTransform: active ? 'uppercase' : 'none',
          letterSpacing: active ? '0.1em' : 'normal',
          fontWeight: active ? 700 : 400,
          transition:'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents:'none'
        }}>
          {label}
        </label>
        {/* Dropdown Menu */}
        <div style={{
          position:'absolute', top:'calc(100% + 8px)', left:0, right:0,
          background:'rgba(15,15,22,0.95)', backdropFilter:'blur(16px)',
          border:'1px solid var(--border)', borderRadius:'12px',
          padding:'8px', zIndex:50,
          opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden',
          transform: open ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          maxHeight: '260px', overflowY: 'auto'
        }}>
          {options.map((opt: string) => (
            <div key={opt} onClick={() => onChange(opt)}
                 style={{
                   padding:'12px 16px', borderRadius:'8px', cursor:'pointer', fontSize:'14px', color:'var(--text-2)',
                   transition:'all 0.15s',
                   background: value === opt ? 'rgba(118,108,255,0.1)' : 'transparent',
                 }}
                 onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff' }}
                 onMouseLeave={e => { e.currentTarget.style.background = value === opt ? 'rgba(118,108,255,0.1)' : 'transparent'; e.currentTarget.style.color = 'var(--text-2)' }}>
              {opt}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Close dropdowns globally when clicking outside
  if (typeof window !== 'undefined') {
    window.onclick = () => {
      // Just a trigger for React to re-render but custom selects handle their own state via event bubbling.
      // Actually, since we stopPropagation on the select wrapper, clicking anywhere else will trigger window.onclick.
      // But we can't easily force all instances to close without context.
      // Wait, we can dispatch a custom event!
    }
  }

  // To properly close custom selects on outside click without context:
  useEffect(() => {
    const fn = () => document.dispatchEvent(new CustomEvent('closeSelects'))
    window.addEventListener('click', fn)
    return () => window.removeEventListener('click', fn)
  }, [])

  const SelectWrapper = ({ children }: any) => {
    const [o, setO] = useState(false)
    // pass o to children... 
    // Wait, the FloatingSelect component should handle this directly! Let's revise it inside.
    return children
  }

  // We'll rewrite the custom select using a robust outside click listener:
  const FloatingSelectWithOutsideClick = ({ label, value, onChange, options }: any) => {
    const [open, setOpen] = useState(false)
    useEffect(() => {
      const fn = () => setOpen(false)
      document.addEventListener('closeSelects', fn)
      return () => document.removeEventListener('closeSelects', fn)
    }, [])
    
    const active = open || value.length > 0
    return (
      <div style={{ position:'relative', width:'100%' }} onClick={(e) => { e.stopPropagation(); document.dispatchEvent(new CustomEvent('closeSelects')); setOpen(!open) }}>
        <div style={{
          ...inpShared,
          padding: '22px 40px 10px 20px', height: '56px', cursor: 'pointer',
          display: 'flex', alignItems: 'flex-end', userSelect: 'none',
          borderColor: open ? 'rgba(118,108,255,0.55)' : 'var(--border)',
          boxShadow: open ? '0 0 0 4px rgba(118,108,255,0.10)' : 'none',
          background: open ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)'
        }}>
          <span style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: value ? 'var(--text)' : 'transparent', fontSize: '15px' }}>
            {value || '-'}
          </span>
          <svg style={{ position: 'absolute', right: '16px', top: '50%', transform: `translateY(-50%) rotate(${open ? '180deg' : '0'})`, transition: 'transform 0.2s', color: 'var(--text-3)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <label style={{
          position:'absolute', left:'20px',
          top: active ? '10px' : '50%',
          transform: active ? 'none' : 'translateY(-50%)',
          fontSize: active ? '10px' : '15px',
          color: active ? 'var(--primary)' : 'var(--text-3)',
          fontFamily: active ? 'var(--font-mono)' : 'var(--font-body)',
          textTransform: active ? 'uppercase' : 'none',
          letterSpacing: active ? '0.1em' : 'normal',
          fontWeight: active ? 700 : 400,
          transition:'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents:'none'
        }}>
          {label}
        </label>
        <div style={{
          position:'absolute', top:'calc(100% + 8px)', left:0, right:0,
          background:'rgba(15,15,22,0.95)', backdropFilter:'blur(16px)',
          border:'1px solid var(--border)', borderRadius:'12px',
          padding:'8px', zIndex:50,
          opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden',
          transform: open ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          maxHeight: '260px', overflowY: 'auto'
        }}>
          {options.map((opt: string) => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false) }}
                 style={{
                   padding:'12px 16px', borderRadius:'8px', cursor:'pointer', fontSize:'14px', color: value === opt ? '#fff' : 'var(--text-2)',
                   transition:'all 0.15s',
                   background: value === opt ? 'var(--primary)' : 'transparent',
                 }}
                 onMouseEnter={e => { if(value!==opt){ e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff' } }}
                 onMouseLeave={e => { if(value!==opt){ e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)' } }}>
              {opt}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section style={{ paddingTop:'110px', paddingBottom:'80px', borderBottom:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 15% 60%, rgba(118,108,255,0.10) 0%, transparent 65%)', pointerEvents:'none' }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <p className="eyebrow">Contact</p>
          <h1 style={{ ...F, fontSize:'clamp(2.8rem,5.5vw,4.6rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em', marginBottom:'20px', maxWidth:'760px' }}>
            Start your project<br />
            <span style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>with a free quote</span>
          </h1>
          <p style={{ fontSize:'17px', color:'var(--text-2)', lineHeight:1.85, maxWidth:'560px', marginBottom:'28px' }}>
            Fill in the form below and we&apos;ll get back to you within 24 hours with a detailed quote and honest recommendations.
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'28px' }}>
            {['30-Day Guarantee','No Contracts','24h Reply','Free Quote'].map(t => (
              <span key={t} className="tag" style={{ color:'var(--text-2)', border:'1px solid var(--border-2)' }}>✓ {t}</span>
            ))}
          </div>
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
            <Link href="/portfolio" className="btn btn-outline btn-lg">View Our Work</Link>
            <a href="#quote" className="btn btn-primary btn-lg">Get Free Quote <ArrowRight size={16} /></a>
          </div>
          <div style={{ marginTop:'32px', maxWidth:'800px' }}>
            <p style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:700, marginBottom:'10px' }}>Verified on Clutch</p>
            <div style={{ borderRadius:'14px', overflow:'hidden', border:'1px solid var(--border)', background:'rgba(10,10,18,0.6)' }}>
              <ClutchWidget widgetType={7} height={70} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ FORM + INFO ══════════════════════════════════════════════ */}
      <section style={{ padding:'96px 0', borderBottom:'1px solid var(--border)' }} id="quote">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.45fr', gap:'72px', alignItems:'start' }}>

            {/* ── LEFT: info ──────────────────────────────────── */}
            <div>
              <h2 style={{ ...F, fontSize:'clamp(1.8rem,2.8vw,2.4rem)', fontWeight:800, color:'#fff', marginBottom:'14px', letterSpacing:'-0.03em', lineHeight:1.1 }}>
                Let&apos;s Build Something<br />
                <span style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Great Together</span>
              </h2>
              <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.9, marginBottom:'36px', maxWidth:'480px' }}>
                Tell us about your project. We&apos;ll reply within 24 hours with a free, no-obligation quote and an honest assessment.
              </p>

              {/* Contact cards */}
              <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'32px' }}>
                {[
                  { Icon:Mail,          label:'Email',            value:'info@ariosetech.com',   href:'mailto:info@ariosetech.com',  note:'Proposals & project discussions' },
                  { Icon:Phone,         label:'Phone / WhatsApp', value:'+92 300 9484 739',       href:'tel:+923009484739',           note:'Quick questions, instant consultation' },
                  { Icon:MapPin,        label:'Office',           value:'Lahore, Pakistan',       href:undefined,                    note:'95 College Road, PCSIR Staff Colony' },
                  { Icon:Clock,         label:'Response Time',    value:'Within 24 Hours',        href:undefined,                    note:'No spam. No lock-in contracts.' },
                ].map(({ Icon, label, value, href, note }) => (
                  <div key={label} style={{ display:'flex', gap:'16px', alignItems:'flex-start', padding:'20px 22px', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'16px', transition:'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor='rgba(118,108,255,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor='var(--border)')}>
                    <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:'rgba(118,108,255,0.10)', border:'1px solid rgba(118,108,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--primary)' }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p style={{ ...M, fontSize:'9px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'4px' }}>{label}</p>
                      {href
                        ? <a href={href} style={{ fontSize:'15px', fontWeight:600, color:'var(--text)', display:'block', marginBottom:'3px', transition:'color 0.15s' }} onMouseEnter={e=>(e.currentTarget.style.color='var(--primary)')} onMouseLeave={e=>(e.currentTarget.style.color='var(--text)')}>{value}</a>
                        : <p style={{ fontSize:'15px', fontWeight:600, color:'var(--text)', marginBottom:'3px' }}>{value}</p>}
                      <p style={{ fontSize:'12px', color:'var(--text-3)', lineHeight:1.6 }}>{note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp */}
              <a href="https://wa.me/923009484739?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project" target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', padding:'18px', borderRadius:'14px', textDecoration:'none', background:'linear-gradient(135deg,#25D366,#128C7E)', color:'#fff', fontSize:'15px', fontWeight:700, fontFamily:'var(--font-display)', marginBottom:'20px', transition:'opacity 0.2s' }}
                onMouseEnter={e=>(e.currentTarget.style.opacity='0.88')} onMouseLeave={e=>(e.currentTarget.style.opacity='1')}>
                <MessageCircle size={20} /> Chat on WhatsApp — Instant Reply
              </a>

              {/* Countries */}
              <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px 22px' }}>
                <p style={{ ...M, fontSize:'9px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'12px' }}>Clients we serve globally</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'7px' }}>
                  {['🇺🇸 USA','🇦🇪 UAE','🇨🇭 Switzerland','🇬🇧 UK','🇦🇺 Australia','🇨🇦 Canada','🇩🇪 Germany','🇵🇰 Pakistan'].map(c => (
                    <span key={c} style={{ fontSize:'12px', color:'var(--text-2)', background:'var(--bg-3)', border:'1px solid var(--border)', padding:'5px 12px', borderRadius:'8px' }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: form ─────────────────────────────────── */}
            <div style={{ background:'var(--bg-2)', border:'1px solid rgba(118,108,255,0.2)', borderRadius:'24px', overflow:'hidden', position:'sticky', top:'88px', boxShadow:'0 32px 80px rgba(0,0,0,0.45)' }}>
              {/* Header */}
              <div style={{ padding:'36px 48px 28px', borderBottom:'1px solid var(--border)', background:'linear-gradient(135deg,rgba(118,108,255,0.09),rgba(118,108,255,0.03))' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
                  <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 8px rgba(34,197,94,0.6)' }} />
                  <span style={{ ...M, fontSize:'10px', color:'#22c55e', textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:700 }}>Accepting new projects</span>
                </div>
                <h3 style={{ ...F, fontSize:'22px', fontWeight:800, color:'#fff', marginBottom:'6px' }}>Request a Free Quote</h3>
                <p style={{ ...M, fontSize:'11px', color:'var(--text-3)' }}>Reply within 24 hours · No commitment · No spam</p>
              </div>

              {sent ? (
                <div style={{ padding:'80px 48px', textAlign:'center' }}>
                  <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:'rgba(118,108,255,0.12)', border:'1px solid rgba(118,108,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'28px' }}>✓</div>
                  <p style={{ ...F, fontSize:'20px', fontWeight:800, color:'#fff', marginBottom:'10px' }}>Message Sent!</p>
                  <p style={{ fontSize:'14px', color:'var(--text-3)', lineHeight:1.8 }}>We&apos;ll get back to you within 24 hours.<br/>Check your inbox — including spam.</p>
                </div>
              ) : (
                <form onSubmit={send} style={{ padding:'40px 48px 48px', display:'flex', flexDirection:'column', gap:'20px' }}>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                    <FloatingInput label="Full Name" value={form.name} onChange={(v:string) => set('name', v)} required />
                    <FloatingInput label="Email Address" type="email" value={form.email} onChange={(v:string) => set('email', v)} required />
                  </div>

                  <FloatingInput label="Phone / WhatsApp (optional)" value={form.phone} onChange={(v:string) => set('phone', v)} />

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                    <FloatingSelectWithOutsideClick label="Service Needed" value={form.service} onChange={(v:string) => set('service', v)} options={SERVICES} />
                    <FloatingSelectWithOutsideClick label="Budget Range" value={form.budget} onChange={(v:string) => set('budget', v)} options={BUDGETS} />
                  </div>

                  <FloatingInput label="Project Details" value={form.message} onChange={(v:string) => set('message', v)} required multiline />

                  {/* Submit */}
                  <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginTop:'10px' }}>
                    <button type="submit" disabled={sending} className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center', padding:'18px 28px', fontSize:'16px' }}>
                      {sending ? (
                        <>
                          <span style={{ width:'16px', height:'16px', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                          Sending your message…
                        </>
                      ) : <>Send Message — Get Free Quote in 24h <ArrowRight size={17} /></>}
                    </button>
                    <p style={{ ...M, fontSize:'11px', color:'var(--text-3)', textAlign:'center', lineHeight:1.7 }}>
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
      <section style={{ padding:'96px 0', borderBottom:'1px solid var(--border)', background:'var(--bg-2)' }}>
        <div className="container" style={{ display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:'56px', alignItems:'center' }}>
          <div>
            <p className="eyebrow">Schedule a Call</p>
            <h2 style={{ ...F, fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em', marginBottom:'18px', color:'#fff' }}>
              Book a Free Strategy Session
            </h2>
            <p style={{ fontSize:'16px', color:'var(--text-2)', lineHeight:1.9, maxWidth:'560px', marginBottom:'22px' }}>
              Prefer to talk? Book a free 30-minute strategy call with our team. We&apos;ll discuss your project, answer questions, and give honest recommendations — no sales pressure.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'28px' }}>
              {['30-minute call','Project advice & recommendations','Transparent pricing discussion','No obligation, no pressure'].map(t => (
                <span key={t} className="tag" style={{ color:'var(--text-2)', border:'1px solid var(--border-2)' }}>✓ {t}</span>
              ))}
            </div>
            <a href="#quote" className="btn btn-primary btn-lg">Schedule your free call <ArrowRight size={16} /></a>
          </div>
          <div style={{ background:'rgba(10,10,18,0.7)', border:'1px solid rgba(118,108,255,0.18)', borderRadius:'24px', padding:'40px', backdropFilter:'blur(20px)' }}>
            <p style={{ ...M, fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.16em', fontWeight:800, marginBottom:'14px' }}>Pick a time that works for you</p>
            <p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.85, marginBottom:'22px' }}>
              Message us on WhatsApp to schedule a call at your convenience. We accommodate all time zones — USA, UAE, UK, and beyond.
            </p>
            <a href="https://wa.me/923009484739?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20strategy%20session" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-md" style={{ width:'100%', justifyContent:'center' }}>
              Chat on WhatsApp to book
            </a>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════════════ */}
      <section style={{ padding:'96px 0', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <p className="eyebrow">FAQ</p>
          <h2 style={{ ...F, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, lineHeight:1.0, letterSpacing:'-0.04em', marginBottom:'40px', color:'#fff' }}>Common Questions</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            {[
              { q:'How long does a website project take?',        a:'Most projects complete in 15–30 days. WordPress: 2–3 weeks. WooCommerce: 3–5 weeks. Shopify: 2–4 weeks. You receive a detailed timeline in every proposal.' },
              { q:'What is your pricing structure?',             a:'WordPress starts at $799, Shopify at $999, WooCommerce at $1,299. Fixed-price quotes — no hourly surprises. Typically 50% upfront, 50% on completion.' },
              { q:'Do you offer ongoing maintenance?',           a:'Yes. Monthly plans from $79/month covering updates, security monitoring, backups, and priority support.' },
              { q:'What is your money-back guarantee?',          a:'30-day money-back guarantee. If we fail to deliver what was agreed, you get a full refund — no questions asked.' },
              { q:'Do you work with clients in the USA & UAE?',  a:'Yes. Most clients are in the USA, UAE, and Switzerland. We schedule calls at your convenience and provide regular async updates.' },
              { q:'Can you work on my existing website?',        a:'Absolutely. Redesigns, speed optimizations, security fixes, migrations, and custom feature development for WordPress, WooCommerce, and Shopify.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'16px', padding:'28px' }}>
                <p style={{ ...F, fontSize:'15px', fontWeight:700, color:'#fff', marginBottom:'10px', lineHeight:1.4 }}>{q}</p>
                <p style={{ fontSize:'13px', color:'var(--text-2)', lineHeight:1.9 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════════ */}
      <section style={{ padding:'120px 0', borderBottom:'1px solid var(--border)', background:'var(--bg-2)' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <p className="eyebrow" style={{ justifyContent:'center' }}>Ready to start?</p>
          <h2 style={{ ...F, fontSize:'clamp(2.4rem,4.5vw,3.6rem)', fontWeight:800, letterSpacing:'-0.04em', color:'#fff', marginBottom:'16px' }}>
            Get a free quote in 24 hours.<br/>No commitment required.
          </h2>
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap', marginTop:'28px' }}>
            <Link href="/portfolio" className="btn btn-outline btn-xl">View Our Work</Link>
            <a href="#quote" className="btn btn-primary btn-xl">Get Free Quote <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>
    </>
  )
}
