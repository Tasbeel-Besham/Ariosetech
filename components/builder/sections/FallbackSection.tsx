type Props = { type?: string }
export default function FallbackSection({ type = 'unknown' }: Props) {
  return (
    <div style={{ padding: '48px 24px', border: '2px dashed rgba(118,108,255,0.3)', borderRadius: '16px', textAlign: 'center', margin: '16px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Unknown section type: &quot;{type}&quot;</p>
      <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>This section type is not registered. Add it to registry-init.tsx.</p>
    </div>
  )
}
