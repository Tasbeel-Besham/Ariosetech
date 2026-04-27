import type { ReactNode } from 'react'

export default function Eyebrow({ children, center }: { children: ReactNode; center?: boolean }) {
  return (
    <p className="eyebrow" style={{ justifyContent: center ? 'center' : undefined }}>
      {children}
    </p>
  )
}
