import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCollection } from '@/lib/db/mongodb'
import { personSchema, profilePageSchema, breadcrumbSchema } from '@/lib/schema'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com'

type Props = { params: Promise<{ slug: string }> }

type Author = {
  name: string; slug: string; role?: string; bio?: string; avatar?: string
  email?: string; linkedin?: string; twitter?: string; website?: string
  expertise?: string[]; published?: boolean
}

async function getAuthor(slug: string): Promise<Author | null> {
  try {
    const col = await getCollection<Author>('authors')
    return (await col.findOne({ slug, published: { $ne: false } } as never)) as Author | null
  } catch { return null }
}

async function getPosts(authorName: string) {
  try {
    const col = await getCollection('blogs')
    return await col
      .find({ author: authorName, published: { $ne: false } } as never)
      .sort({ publishedAt: -1 })
      .limit(24)
      .toArray()
  } catch { return [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = await getAuthor(slug)
  if (!a) return { title: 'Author Not Found' }
  const desc = a.bio
    ? a.bio.slice(0, 155)
    : `${a.name}${a.role ? `, ${a.role}` : ''} at ARIOSETECH. Read their articles on WordPress, WooCommerce and Shopify development.`
  return {
    title: `${a.name}${a.role ? ` — ${a.role}` : ''}`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/author/${a.slug}` },
    openGraph: {
      type: 'profile',
      title: `${a.name}${a.role ? ` — ${a.role}` : ''}`,
      description: desc,
      url: `${SITE_URL}/author/${a.slug}`,
      ...(a.avatar ? { images: [a.avatar] } : {}),
    },
  }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params
  const author = await getAuthor(slug)
  if (!author) notFound()

  const posts = await getPosts(author.name)
  const url = `${SITE_URL}/author/${author.slug}`
  const sameAs = [author.linkedin, author.twitter, author.website].filter(Boolean) as string[]

  const person = personSchema({
    name: author.name,
    url,
    jobTitle: author.role,
    description: author.bio,
    image: author.avatar,
    email: author.email,
    sameAs,
    knowsAbout: author.expertise,
  })

  const schemas = [
    profilePageSchema({ name: author.name, url, person }),
    breadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Blog', url: `${SITE_URL}/blog` },
      { name: author.name, url },
    ]),
  ]

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <section className="section pt-[120px]">
        <div className="container max-w-[860px]">
          <Link href="/blog" className="font-mono text-11 uppercase tracking-widest font-semibold" style={{ color: 'var(--primary)' }}>
            ← Back to Blog
          </Link>

          {/* Profile header */}
          <div className="flex flex-col sm:flex-row items-start gap-7 mt-8 mb-12">
            {author.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={author.avatar} alt={author.name}
                   className="w-[104px] h-[104px] rounded-2xl object-cover shrink-0 border border-subtle" />
            ) : (
              <div className="w-[104px] h-[104px] rounded-2xl bg-grad flex items-center justify-center font-display text-3xl font-extrabold text-white shrink-0">
                {author.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-display font-extrabold tracking-tighter leading-none section-headline mb-2">
                {author.name}
              </h1>
              {author.role && (
                <p className="font-mono text-11 uppercase tracking-widest font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                  {author.role}
                </p>
              )}
              {author.bio && <p className="text-gray-2 leading-loose">{author.bio}</p>}

              {sameAs.length > 0 && (
                <div className="flex gap-4 mt-5 flex-wrap">
                  {author.linkedin && (
                    <a href={author.linkedin} target="_blank" rel="noopener noreferrer me"
                       className="font-mono text-10 uppercase tracking-wider font-semibold" style={{ color: 'var(--primary)' }}>LinkedIn</a>
                  )}
                  {author.twitter && (
                    <a href={author.twitter} target="_blank" rel="noopener noreferrer me"
                       className="font-mono text-10 uppercase tracking-wider font-semibold" style={{ color: 'var(--primary)' }}>X / Twitter</a>
                  )}
                  {author.website && (
                    <a href={author.website} target="_blank" rel="noopener noreferrer me"
                       className="font-mono text-10 uppercase tracking-wider font-semibold" style={{ color: 'var(--primary)' }}>Website</a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Areas of expertise */}
          {author.expertise && author.expertise.length > 0 && (
            <div className="mb-12">
              <p className="eyebrow">Areas of Expertise</p>
              <div className="flex gap-3 flex-wrap mt-3">
                {author.expertise.map(t => (
                  <span key={t} className="font-mono text-10 uppercase tracking-wider font-bold px-[12px] py-[5px] rounded-full border border-subtle bg-subtle-2">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Their posts */}
          <div>
            <p className="eyebrow">Articles by {author.name}</p>
            {posts.length === 0 ? (
              <p className="text-gray-3 mt-4">No published articles yet.</p>
            ) : (
              <div className="flex flex-col gap-5 mt-5">
                {(posts as unknown as Record<string, string>[]).map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`}
                        className="card card-hover p-6 rounded-2xl no-underline block">
                    <h2 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--heading)' }}>{p.title}</h2>
                    {p.excerpt && <p className="text-gray-3 text-sm leading-relaxed">{p.excerpt}</p>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
