import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface StickyNoteProps {
  content?: string
  children?: ReactNode
  color: string
  rotate?: 'left' | 'right' | 'none'
  className?: string
  pinType?: 'pin' | 'tape' | 'none'
  href?: string
}

const NOTE_COLORS: Record<string, string> = {
  yellow: '#fef08a',
  green: '#bbf7d0',
  purple: '#ddd6fe',
  blue: '#bfdbfe',
  orange: '#fed7aa',
  mint: '#bbf7d0',
  coral: '#fecaca',
  lavender: '#e9d5ff',
  peach: '#fdba74',
  sky: '#bae6fd',
  rose: '#fbcfe8',
  lime: '#d9f99d',
  cyan: '#a5f3fc',
  amber: '#fde68a',
  teal: '#99f6e4',
}

export function StickyNote({
  content,
  children,
  color,
  rotate = 'none',
  className,
  pinType = 'pin',
  href,
}: StickyNoteProps) {
  const noteRef = useRef<HTMLDivElement>(null)
  const [hasPeeled, setHasPeeled] = useState(false)
  const [isPeeling, setIsPeeling] = useState(false)

  useEffect(() => {
    if (pinType !== 'tape') {
      return
    }

    const noteElement = noteRef.current
    if (!noteElement) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasPeeled) {
          return
        }

        setHasPeeled(true)
        setIsPeeling(true)
      },
      { threshold: 0.35 },
    )

    observer.observe(noteElement)

    return () => {
      observer.disconnect()
    }
  }, [hasPeeled, pinType])

  const rotation =
    rotate === 'left' ? '-2deg' : rotate === 'right' ? '2deg' : '0deg'

  const noteStyle = {
    '--labs-note-bg': NOTE_COLORS[color] ?? '#ffffff',
    '--labs-note-rotation': rotation,
  } as CSSProperties

  const body = (
    <div
      className={cn(
        'labs-sticky-note',
        isPeeling && 'labs-sticky-note--peeled',
        className,
      )}
      style={noteStyle}
      onAnimationEnd={() => {
        setIsPeeling(false)
      }}
    >
      {content ?? children}
    </div>
  )

  return (
    <div ref={noteRef} className="labs-sticky-note-shell">
      {pinType === 'tape' ? (
        <div className="labs-sticky-note__tape" aria-hidden="true">
          <div className="labs-sticky-note__tape-strip" />
        </div>
      ) : null}

      {href ? (
        <a href={href} className="labs-sticky-note__link">
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  )
}

export default StickyNote
