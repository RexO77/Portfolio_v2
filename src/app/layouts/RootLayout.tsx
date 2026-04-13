import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLocation, useOutlet } from 'react-router-dom'
import { useIntroState } from '@/features/intro/useIntroState'

export function RootLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  const shouldReduceMotion = useReducedMotion()
  const scrollRootRef = useRef<HTMLDivElement>(null)
  const { isIntroActive, introComplete } = useIntroState()
  const shouldAnimateRouteShell = !isIntroActive && introComplete && !shouldReduceMotion

  useEffect(() => {
    const scrollRoot = scrollRootRef.current
    if (!scrollRoot || isIntroActive) {
      return
    }

    let frame = 0
    let attempts = 0

    const syncScrollPosition = () => {
      if (location.hash) {
        const target = scrollRoot.querySelector<HTMLElement>(location.hash)
        if (target) {
          target.scrollIntoView({
            block: 'start',
            behavior: shouldReduceMotion ? 'auto' : 'smooth',
          })
          return
        }

        if (attempts < 12) {
          attempts += 1
          frame = window.requestAnimationFrame(syncScrollPosition)
          return
        }
      }

      scrollRoot.scrollTo({
        top: 0,
        behavior: 'auto',
      })
    }

    frame = window.requestAnimationFrame(syncScrollPosition)

    return () => window.cancelAnimationFrame(frame)
  }, [isIntroActive, location.hash, location.pathname, shouldReduceMotion])

  return (
    <div
      ref={scrollRootRef}
      className={`scroll-root${isIntroActive ? ' scroll-root--locked' : ''}`}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={location.pathname}
          className="route-shell"
          initial={shouldAnimateRouteShell ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldAnimateRouteShell ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
          transition={
            shouldAnimateRouteShell
              ? { duration: 0.28, ease: [0.23, 1, 0.32, 1] }
              : { duration: 0 }
          }
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
