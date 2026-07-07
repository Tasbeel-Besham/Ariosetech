'use client'

import { useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Copy, Check } from '@/components/ui/Icons'
import toast from 'react-hot-toast'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

type SchemaType = 'Service' | 'FAQPage' | 'Article' | 'LocalBusiness' | 'BreadcrumbList'

export default function SchemaGeneratorPage() {
  const [type, setType] = useState<SchemaType>('Service')
  const [copied, setCopied] = useState(false)

  // shared fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [path, setPath] = useState('/')
  const [image, setImage] = useState('')
  const [priceFrom, setPriceFrom] = useState('')
  // faq
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([{ q: '', a: '' }])
  // article
  const [author, setAuthor] = useState('ARIOSETECH Team')
  const [datePublished, setDatePublished] = useState('')
  // breadcrumb
  const [crumbs, setCrumbs] = useState<{ name: string; path: string }[]>([{ name: 'Home', path: '/' }])

  const url = `${SITE}${path.startsWith('/') ? '' : '/'}${path}`.replace(/\/$/, '') || SITE

  function build(): object {
    switch (type) {
      case 'Service':
        return {
          '@context': 'https://schema.org', '@type': 'Service',
          name: name || undefined, description: description || undefined, url,
          provider: { '@type': 'Organization', name: 'ARIOSETECH', url: SITE },
          areaServed: ['PK', 'US', 'AE', 'CH', 'GB'],
          ...(priceFrom ? { offers: { '@type': 'Offer', price: priceFrom.replace(/[^0-9.]/g, ''), priceCurrency: 'USD', url } } : {}),
        }
      case 'FAQPage':
        return {
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: faqs.filter(f => f.q && f.a).map(f => ({
            '@type': 'Question', name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      case 'Article':
        return {
          '@context': 'https://schema.org', '@type': 'BlogPosting',
          headline: name || undefined, description: description || undefined, url,
          image: image ? [image] : undefined,
          datePublished: datePublished || undefined,
          dateModified: datePublished || undefined,
          author: { '@type': 'Organization', name: author || 'ARIOSETECH' },
          publisher: { '@type': 'Organization', name: 'ARIOSETECH' },
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        }
      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org', '@type': 'ProfessionalService',
          name: name || 'ARIOSETECH', description: description || undefined, url: SITE,
          email: 'info@ariosetech.com', telephone: '+92-300-9484739', priceRange: '$$',
          address: { '@type': 'PostalAddress', streetAddress: '95 College Road, Block E, PCSIR Staff Colony', addressLocality: 'Lahore', postalCode: '54770', addressCountry: 'PK' },
          areaServed: ['PK', 'US', 'AE', 'CH', 'GB'],
        }
      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: crumbs.filter(c => c.name).map((c, i) => ({
            '@type': 'ListItem', position: i + 1, name: c.name,
            item: `${SITE}${c.path.startsWith('/') ? '' : '/'}${c.path}`,
          })),
        }
    }
  }

  const output = `<script type="application/ld+json">\n${JSON.stringify(build(), null, 2)}\n</script>`

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true); toast.success('Copied JSON-LD')
    setTimeout(() => setCopied(false), 1500)
  }

  const cardClass = 'bg-bg-2 border border-border rounded-2xl p-6 mb-5'
  const lbl = 'font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5'
  const inp = 'w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body focus:border-primary/50 transition-colors'

  const TYPES: { id: SchemaType; label: string; hint: string }[] = [
    { id: 'Service', label: 'Service', hint: 'A service you offer' },
    { id: 'FAQPage', label: 'FAQ', hint: 'Q&A that can earn rich results' },
    { id: 'Article', label: 'Article', hint: 'Blog post or news' },
    { id: 'LocalBusiness', label: 'Local Business', hint: 'Your business details' },
    { id: 'BreadcrumbList', label: 'Breadcrumbs', hint: 'Page hierarchy trail' },
  ]

  return (
    <AdminShell>
      <div className="p-8 max-w-[820px]">
        <div className="mb-7">
          <h1 className="admin-page__title">Schema Generator</h1>
          <p className="admin-page__subtitle">Generate copy-ready JSON-LD structured data. Your builder pages get WebPage, Breadcrumb and Service schema automatically — use this for anything custom.</p>
        </div>

        {/* Type picker */}
        <div className={cardClass}>
          <label className={lbl}>Schema type</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                className={`py-2 px-3.5 rounded-lg border text-[12.5px] font-semibold font-display transition-colors ${type === t.id ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border bg-transparent text-text-3 hover:text-white'}`}
                title={t.hint}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className={cardClass}>
          <h2 className="font-display text-[15px] font-bold text-white mb-4">Details</h2>

          {(type === 'Service' || type === 'Article' || type === 'LocalBusiness') && (
            <div className="mb-4"><label className={lbl}>{type === 'Article' ? 'Headline' : 'Name'}</label>
              <input value={name} onChange={e => setName(e.target.value)} className={inp} placeholder={type === 'Service' ? 'WordPress Development' : type === 'Article' ? 'Post title' : 'ARIOSETECH'} /></div>
          )}

          {(type === 'Service' || type === 'Article' || type === 'LocalBusiness') && (
            <div className="mb-4"><label className={lbl}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className={`${inp} resize-y`} placeholder="A short, accurate description." /></div>
          )}

          {(type === 'Service' || type === 'Article') && (
            <div className="mb-4"><label className={lbl}>Page path</label>
              <input value={path} onChange={e => setPath(e.target.value)} className={`${inp} font-mono text-xs`} placeholder="/services/wordpress" /></div>
          )}

          {type === 'Service' && (
            <div className="mb-4"><label className={lbl}>Starting price (optional)</label>
              <input value={priceFrom} onChange={e => setPriceFrom(e.target.value)} className={inp} placeholder="799" /></div>
          )}

          {type === 'Article' && (
            <>
              <div className="mb-4"><label className={lbl}>Image URL</label>
                <input value={image} onChange={e => setImage(e.target.value)} className={`${inp} font-mono text-xs`} placeholder="https://…" /></div>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <div><label className={lbl}>Author</label>
                  <input value={author} onChange={e => setAuthor(e.target.value)} className={inp} /></div>
                <div><label className={lbl}>Date published</label>
                  <input type="date" value={datePublished} onChange={e => setDatePublished(e.target.value)} className={inp} /></div>
              </div>
            </>
          )}

          {type === 'FAQPage' && (
            <div className="flex flex-col gap-3">
              {faqs.map((f, i) => (
                <div key={i} className="p-3 rounded-xl bg-bg-3 border border-border flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-text-3">Q{i + 1}</span>
                    {faqs.length > 1 && <button onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="text-[11px] text-[#ff4d6d]">Remove</button>}
                  </div>
                  <input value={f.q} onChange={e => setFaqs(faqs.map((x, j) => j === i ? { ...x, q: e.target.value } : x))} className={inp} placeholder="Question" />
                  <textarea value={f.a} onChange={e => setFaqs(faqs.map((x, j) => j === i ? { ...x, a: e.target.value } : x))} rows={2} className={`${inp} resize-y`} placeholder="Answer" />
                </div>
              ))}
              <button onClick={() => setFaqs([...faqs, { q: '', a: '' }])} className="btn btn-outline btn-sm self-start">+ Add question</button>
            </div>
          )}

          {type === 'BreadcrumbList' && (
            <div className="flex flex-col gap-2">
              {crumbs.map((c, i) => (
                <div key={i} className="flex gap-2 items-center max-sm:flex-col max-sm:items-stretch">
                  <input value={c.name} onChange={e => setCrumbs(crumbs.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} className={`${inp} flex-1`} placeholder="Label (e.g. Services)" />
                  <input value={c.path} onChange={e => setCrumbs(crumbs.map((x, j) => j === i ? { ...x, path: e.target.value } : x))} className={`${inp} flex-1 font-mono text-xs`} placeholder="/services" />
                  {crumbs.length > 1 && <button onClick={() => setCrumbs(crumbs.filter((_, j) => j !== i))} className="text-[11px] text-[#ff4d6d] shrink-0">✕</button>}
                </div>
              ))}
              <button onClick={() => setCrumbs([...crumbs, { name: '', path: '/' }])} className="btn btn-outline btn-sm self-start">+ Add crumb</button>
            </div>
          )}

          {type === 'LocalBusiness' && (
            <p className="text-[12px] text-text-3 leading-relaxed">Your real business details (address, phone, email) are pre-filled. Just add a name and description if you want to override the defaults.</p>
          )}
        </div>

        {/* Output */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-[15px] font-bold text-white">Generated JSON-LD</h2>
            <button onClick={copy} className="btn btn-primary btn-sm">
              {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
            </button>
          </div>
          <pre className="bg-[#0a0a14] border border-border-2 rounded-xl p-4 overflow-x-auto text-[12px] leading-relaxed text-[#c8c8e0] font-mono whitespace-pre">{output}</pre>
          <p className="text-[11px] text-text-3 mt-3 leading-relaxed">Paste this into the page&apos;s HTML head, or into a Custom HTML block. For builder pages you usually don&apos;t need this — schema is added automatically.</p>
        </div>
      </div>
    </AdminShell>
  )
}
