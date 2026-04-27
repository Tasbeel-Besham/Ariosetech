'use client'
import { useEffect } from 'react'

declare global {
  interface Window { CLUTCHCO?: { Init: () => void } }
}

type Props = {
  widgetType: number
  height?: number | 'auto'
  reviews?: string
  className?: string
  style?: React.CSSProperties
}

let scriptLoaded = false

export default function ClutchWidget({ widgetType, height = 65, reviews, className, style }: Props) {
  useEffect(() => {
    const init = () => {
      if (window.CLUTCHCO) window.CLUTCHCO.Init()
    }
    if (scriptLoaded) { init(); return }
    const existing = document.querySelector('script[src*="widget.clutch.co"]')
    if (existing) { scriptLoaded = true; init(); return }
    const script = document.createElement('script')
    script.src = 'https://widget.clutch.co/static/js/widget.js'
    script.async = true
    script.onload = () => { scriptLoaded = true; init() }
    document.head.appendChild(script)
  }, [widgetType])

  return (
    <div
      className={`clutch-widget${className ? ` ${className}` : ''}`}
      data-url="https://widget.clutch.co"
      data-widget-type={String(widgetType)}
      data-height={String(height)}
      data-nofollow="false"
      data-expandifr="true"
      data-scale="100"
      data-clutchcompany-id="2455464"
      {...(reviews ? { 'data-reviews': reviews } : {})}
      style={style}
    />
  )
}
