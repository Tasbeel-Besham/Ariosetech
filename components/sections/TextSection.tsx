type Props = { content?: string }
export default function TextSection({ content = 'Edit this text block.' }: Props) {
  return (
    <section className="section">
      <div className="container">
        <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.85, maxWidth: '720px', whiteSpace: 'pre-wrap' }}>{content}</p>
      </div>
    </section>
  )
}
