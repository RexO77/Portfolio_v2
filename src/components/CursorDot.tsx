import { useEffect, useRef } from 'react'

const CURSOR_SIZE = 18
const CURSOR_OFFSET = CURSOR_SIZE / 2

export function CursorDot() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const canUseCursor = window.matchMedia('(hover: hover) and (pointer: fine)')
    const cursor = cursorRef.current
    if (!cursor || !canUseCursor.matches) {
      return undefined
    }

    let frame = 0
    let nextX = 0
    let nextY = 0

    const setVisible = (visible: boolean) => {
      cursor.dataset.visible = visible ? 'true' : 'false'
    }

    const updatePosition = () => {
      frame = 0
      // Keep the dot on the compositor path; we only update once per frame.
      cursor.style.transform = `translate3d(${nextX - CURSOR_OFFSET}px, ${nextY - CURSOR_OFFSET}px, 0)`
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        setVisible(false)
        return
      }

      nextX = event.clientX
      nextY = event.clientY
      setVisible(true)

      if (frame === 0) {
        frame = window.requestAnimationFrame(updatePosition)
      }
    }

    const handlePointerLeave = () => {
      setVisible(false)
    }

    document.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('blur', handlePointerLeave)

    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('blur', handlePointerLeave)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={cursorRef} className="cursor-dot" aria-hidden="true" />
}
