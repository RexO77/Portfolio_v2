import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { introGreetings } from './intro-data'

interface IntroLoaderProps {
  canExit: boolean
  onExitStart: () => void
  onComplete: () => void
}

// Sequential transition (mode="wait"): previous greeting eases out fully,
// then the next eases in. stepMs = exit (180ms) + enter (200ms) + hold (120ms).
// Seven greetings × 500ms + 400ms wrapper fade ≈ 3.9s (under the 4s budget).
const STANDARD_STEP_MS = 500
const REDUCED_MOTION_STEP_MS = 380
const STANDARD_EXIT_MS = 400
const REDUCED_MOTION_EXIT_MS = 260

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
const EASE_IN: [number, number, number, number] = [0.64, 0, 0.78, 0]
const EASE_INOUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

export function IntroLoader({ canExit, onExitStart, onComplete }: IntroLoaderProps) {
  const prefersReducedMotion = useReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sequenceComplete, setSequenceComplete] = useState(false)

  const stepMs = prefersReducedMotion
    ? REDUCED_MOTION_STEP_MS
    : STANDARD_STEP_MS
  const exitMs = prefersReducedMotion ? REDUCED_MOTION_EXIT_MS : STANDARD_EXIT_MS
  const isExiting = sequenceComplete && canExit

  useEffect(() => {
    if (sequenceComplete) {
      return undefined
    }

    const isLastGreeting = currentIndex === introGreetings.length - 1
    const timeoutId = window.setTimeout(() => {
      if (isLastGreeting) {
        setSequenceComplete(true)
        return
      }

      setCurrentIndex((index) => index + 1)
    }, stepMs)

    return () => window.clearTimeout(timeoutId)
  }, [currentIndex, sequenceComplete, stepMs])

  useEffect(() => {
    if (!isExiting) {
      return undefined
    }

    onExitStart()

    const timeoutId = window.setTimeout(() => {
      onComplete()
    }, exitMs)

    return () => window.clearTimeout(timeoutId)
  }, [exitMs, isExiting, onComplete, onExitStart])

  const activeGreeting = introGreetings[currentIndex]

  const enterDuration = prefersReducedMotion ? 0.18 : 0.2
  const exitDuration = prefersReducedMotion ? 0.14 : 0.18
  const yOffset = prefersReducedMotion ? 0 : 12

  return (
    <motion.div
      className={`intro-loader${isExiting ? ' intro-loader--exiting' : ''}`}
      initial={false}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{
        duration: isExiting ? exitMs / 1000 : 0.3,
        ease: EASE_INOUT,
      }}
    >
      <div className="intro-loader__stage" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            className="intro-loader__greeting"
            data-script={activeGreeting.script}
            dir={activeGreeting.dir}
            initial={{ opacity: 0, y: yOffset }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: enterDuration, ease: EASE_OUT },
            }}
            exit={{
              opacity: 0,
              y: -yOffset,
              transition: { duration: exitDuration, ease: EASE_IN },
            }}
          >
            {activeGreeting.greeting}
          </motion.p>
        </AnimatePresence>

        <p className="sr-only" aria-live="polite">
          Opening portfolio introduction.
        </p>
      </div>
    </motion.div>
  )
}
