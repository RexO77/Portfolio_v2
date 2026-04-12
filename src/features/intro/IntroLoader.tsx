import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { introGreetings } from './intro-data'

interface IntroLoaderProps {
  canExit: boolean
  onExitStart: () => void
  onComplete: () => void
}

const STANDARD_STEP_MS = 260
const REDUCED_MOTION_STEP_MS = 220
const STANDARD_EXIT_MS = 420
const REDUCED_MOTION_EXIT_MS = 280

export function IntroLoader({
  canExit,
  onExitStart,
  onComplete,
}: IntroLoaderProps) {
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

  return (
    <motion.div
      className={`intro-loader${isExiting ? ' intro-loader--exiting' : ''}`}
      initial={false}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.18 : 0.32,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      <div className="intro-loader__stage" aria-hidden="true">
        <AnimatePresence initial={false} mode="sync">
          <motion.p
            key={currentIndex}
            className="intro-loader__greeting"
            data-script={activeGreeting.script}
            dir={activeGreeting.dir}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.14 : 0.22,
              ease: [0.23, 1, 0.32, 1],
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
