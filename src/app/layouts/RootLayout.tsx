import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useLocation, useOutlet } from 'react-router-dom'
import ClickBurstOverlay from '@/components/ClickBurstOverlay'
import { CursorDot } from '@/components/CursorDot'
import UISoundProvider from '@/components/UISoundProvider'
import { useIntroState } from '@/features/intro/useIntroState'

const HASH_SCROLL_MAX_ATTEMPTS = 40
const HASH_SCROLL_RETRY_DELAY_MS = 50

export function RootLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  const shouldReduceMotion = useReducedMotion()
  const scrollRootRef = useRef<HTMLDivElement>(null)
  const { isIntroActive } = useIntroState()

  useEffect(() => {
    const scrollRoot = scrollRootRef.current
    if (!scrollRoot || isIntroActive) {
      return
    }

    let cancelled = false
    let attempts = 0
    let frame = 0
    let timeoutId = 0

    const syncScrollPosition = () => {
      if (cancelled) {
        return
      }

      if (location.hash) {
        const target = scrollRoot.querySelector<HTMLElement>(location.hash)
        if (target) {
          target.scrollIntoView({
            block: 'start',
            behavior: shouldReduceMotion ? 'auto' : 'smooth',
          })
          return
        }

        if (attempts < HASH_SCROLL_MAX_ATTEMPTS) {
          attempts += 1
          timeoutId = window.setTimeout(() => {
            frame = window.requestAnimationFrame(syncScrollPosition)
          }, HASH_SCROLL_RETRY_DELAY_MS)
          return
        }
      }

      scrollRoot.scrollTo({
        top: 0,
        behavior: 'auto',
      })
    }

    frame = window.requestAnimationFrame(syncScrollPosition)

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeoutId)
    }
  }, [isIntroActive, location.hash, location.pathname, outlet, shouldReduceMotion])

  return (
    <div
      ref={scrollRootRef}
      className={`scroll-root${isIntroActive ? ' scroll-root--locked' : ''}`}
    >
      <UISoundProvider />
      <ClickBurstOverlay />
      {/* The desktop cursor is a DOM layer so it can invert against any surface. */}
      <CursorDot />
      <div className="route-shell">{outlet}</div>
    </div>
  )
}
