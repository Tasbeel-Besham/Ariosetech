'use client'

import React, { useState, useEffect } from 'react'

const LOG_LINES = [
  { text: '[    0.000000] Linux version 6.5.0-ariosetech-core', color: 'rgba(255,255,255,0.4)', delay: 400 },
  { text: '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-linux root=UUID=... ro', color: 'rgba(255,255,255,0.4)', delay: 800 },
  { text: '[  OK  ] Started Security Hardening Service.', color: '#00ffa3', delay: 1400 },
  { text: '[  OK  ] Initialized Advanced WAF Filter.', color: '#00ffa3', delay: 2000 },
  { text: '[ INFO ] Audit: /wp-content integrity check PASSED', color: 'rgba(255,255,255,0.6)', delay: 2800 },
  { text: '[  OK  ] Threat Isolation Layer: ACTIVE', color: '#00ffa3', bold: true, delay: 3500 },
  { text: 'systemd[1]: Reached target Security Hardening.', color: '#fff', delay: 4200 },
]

export default function TypingTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [currentText, setCurrentText] = useState('')
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    if (lineIndex >= LOG_LINES.length) return

    const line = LOG_LINES[lineIndex]
    let charIndex = 0
    
    const timer = setInterval(() => {
      setCurrentText(line.text.substring(0, charIndex + 1))
      charIndex++
      
      if (charIndex >= line.text.length) {
        clearInterval(timer)
        setTimeout(() => {
          setVisibleLines(prev => prev + 1)
          setLineIndex(prev => prev + 1)
          setCurrentText('')
        }, 300)
      }
    }, 40)

    return () => clearInterval(timer)
  }, [lineIndex])

  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.8 }}>
      {LOG_LINES.slice(0, visibleLines).map((line, i) => (
        <p key={i} style={{ color: line.color, fontWeight: line.bold ? 700 : 400, margin: 0 }}>
          {line.text}
        </p>
      ))}
      {lineIndex < LOG_LINES.length && (
        <p style={{ color: LOG_LINES[lineIndex].color, fontWeight: LOG_LINES[lineIndex].bold ? 700 : 400, margin: 0 }}>
          {currentText}
          <span className="terminal-cursor" />
        </p>
      )}
      <style jsx>{`
        .terminal-cursor {
          display: inline-block;
          width: 8px;
          height: 15px;
          background: var(--primary);
          margin-left: 4px;
          vertical-align: middle;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
