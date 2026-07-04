"use client";
type Props = { content?: string }
export default function TextSection({ content = 'Edit this text block.' }: Props) {
  return (
    <section className="section">
      <div className="container">
        <p className="text-[16px] text-[var(--text-2)] leading-[1.85] max-w-[720px] whitespace-pre-wrap">{content}</p>
      </div>
    </section>
  )
}
