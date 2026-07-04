"use client";
type Props = { type?: string }
export default function FallbackSection({ type = 'unknown' }: Props) {
  return (
    <div className="fallback-box">
      <p className="fallback-title">Unknown section type: &quot;{type}&quot;</p>
      <p className="fallback-desc">This section type is not registered. Add it to registry-init.tsx.</p>
    </div>
  )
}
