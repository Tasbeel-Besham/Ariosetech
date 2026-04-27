import type { ReactNode, CSSProperties } from 'react'

interface SectionProps {
  children: ReactNode
  dark?: boolean
  darker?: boolean
  noBorder?: boolean
  hero?: boolean
  mesh?: boolean
  dots?: boolean
  style?: CSSProperties
  id?: string
  className?: string
}

export default function Section({
  children, dark, darker, noBorder, hero, mesh, dots, style, id, className,
}: SectionProps) {
  const classes = [
    'section',
    dark ? 'section--dark' : '',
    darker ? 'section--darker' : '',
    noBorder ? 'section--no-border' : '',
    hero ? 'section--hero' : '',
    className || '',
  ].filter(Boolean).join(' ')

  return (
    <section id={id} className={classes} style={style}>
      {mesh && <div className="bg-mesh" />}
      {dots && <div className="bg-dot-grid" />}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </section>
  )
}
