import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { introGreetings, type IntroScript } from './intro-data'

interface IntroLoaderProps {
  canExit: boolean
  onExitStart: () => void
  onComplete: () => void
}

// Sequential transition (mode="wait"): each greeting fully fades in, holds,
// then fades out before the next begins. Only one greeting is ever on screen,
// which keeps the composition clean and readable.
//
// stepMs is the cadence between greeting starts and equals
// enter (240ms) + hold (170ms) + exit (190ms) = 600ms.
// Seven greetings × 600ms ≈ 4.2s of sequence + 340ms wrapper fade.
// The sequence does not start until the greeting fonts are actually loaded
// (see `glyphsReady`), so each greeting paints in its real script on its
// first frame — no FOUT / fallback flash.
const STANDARD_STEP_MS = 600
const REDUCED_MOTION_STEP_MS = 340
const STANDARD_EXIT_MS = 340
const REDUCED_MOTION_EXIT_MS = 200

// Cap how long we'll wait for the Indic webfonts before falling back to
// system glyphs. On a fast/cached load this resolves in a handful of ms; on
// a cold network we don't want to leave the user staring at a blank loader.
const FONT_PRELOAD_MAX_MS = 1200

// Buttery, "settled" easing. Slight asymmetry: enter eases out softly so it
// arrives without snap; exit keeps enough ease-in to leave with intent without
// feeling pulled away.
const EASE_ENTER: [number, number, number, number] = [0.16, 1, 0.3, 1]
const EASE_EXIT: [number, number, number, number] = [0.55, 0, 0.35, 1]
const EASE_INOUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

// Maps each script to the actual font family the greeting paints in. Mirrors
// the data-script CSS in intro-loader.css; kept here so we can preload the
// exact (family + glyph) combination before the sequence starts.
const SCRIPT_FONT_FAMILY: Record<IntroScript, string> = {
  latin: 'Inclusive Sans',
  devanagari: 'Noto Sans Devanagari',
  bengali: 'Noto Sans Bengali',
  telugu: 'Noto Sans Telugu',
  tamil: 'Noto Sans Tamil',
  kannada: 'Noto Sans Kannada',
  malayalam: 'Noto Sans Malayalam',
}

async function preloadGreetingGlyphs(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return
  }

  // Wait for the Google Fonts stylesheet to register every @font-face
  // declaration. Without this, document.fonts.load() can resolve immediately
  // as a no-op because the family it's asked about isn't known yet.
  await document.fonts.ready.catch(() => undefined)

  // Touch each greeting's exact glyphs against its real family. The promise
  // resolves once the font file containing those glyphs is downloaded and
  // parsed, so the next paint of that greeting renders in its real script.
  const loads = introGreetings.map((greeting) => {
    const family = SCRIPT_FONT_FAMILY[greeting.script]
    const spec = `500 100px "${family}"`
    return document.fonts
      .load(spec, greeting.greeting)
      .then(() => undefined)
      .catch(() => undefined)
  })

  await Promise.all(loads)
}

export function IntroLoader({ canExit, onExitStart, onComplete }: IntroLoaderProps) {
  const prefersReducedMotion = useReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sequenceComplete, setSequenceComplete] = useState(false)
  const [glyphsReady, setGlyphsReady] = useState(false)
  const sequenceStartedRef = useRef(false)

  const stepMs = prefersReducedMotion
    ? REDUCED_MOTION_STEP_MS
    : STANDARD_STEP_MS
  const exitMs = prefersReducedMotion ? REDUCED_MOTION_EXIT_MS : STANDARD_EXIT_MS
  const isExiting = sequenceComplete && canExit

  // Glyph preload — runs once on mount. We race against a hard cap so a
  // pathologically slow font fetch can't trap the loader. On warm visits this
  // typically resolves within a single frame.
  useEffect(() => {
    if (glyphsReady) {
      return undefined
    }

    let cancelled = false
    const settle = () => {
      if (!cancelled) {
        setGlyphsReady(true)
      }
    }

    const timeoutId = window.setTimeout(settle, FONT_PRELOAD_MAX_MS)
    preloadGreetingGlyphs().then(() => {
      window.clearTimeout(timeoutId)
      settle()
    })

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [glyphsReady])

  // Sequence advance — only kicks in once glyphs are ready, so the very first
  // greeting paints in its real font on its first frame.
  useEffect(() => {
    if (!glyphsReady || sequenceComplete) {
      return undefined
    }

    sequenceStartedRef.current = true

    const isLastGreeting = currentIndex === introGreetings.length - 1
    const timeoutId = window.setTimeout(() => {
      if (isLastGreeting) {
        setSequenceComplete(true)
        return
      }

      setCurrentIndex((index) => index + 1)
    }, stepMs)

    return () => window.clearTimeout(timeoutId)
  }, [currentIndex, glyphsReady, sequenceComplete, stepMs])

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

  // Short, smooth single-element transitions. With mode="wait", these run
  // back-to-back (exit → enter) so the perceived gap between greetings is
  // exitDuration. Numbers chosen to sum to stepMs:
  //   enter (240ms) + hold (~170ms idle) + exit (190ms) = 600ms.
  const enterDuration = prefersReducedMotion ? 0.14 : 0.24
  const exitDuration = prefersReducedMotion ? 0.12 : 0.19
  const yOffset = prefersReducedMotion ? 0 : 6
  const blurAmount = prefersReducedMotion ? 0 : 3

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
        <AnimatePresence mode="wait" initial={false}>
          {glyphsReady ? (
            <motion.p
              key={currentIndex}
              className="intro-loader__greeting"
              data-script={activeGreeting.script}
              dir={activeGreeting.dir}
              initial={{
                opacity: 0,
                y: yOffset,
                filter: blurAmount ? `blur(${blurAmount}px)` : 'none',
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: enterDuration, ease: EASE_ENTER },
              }}
              exit={{
                opacity: 0,
                y: -yOffset,
                filter: blurAmount ? `blur(${blurAmount}px)` : 'none',
                transition: { duration: exitDuration, ease: EASE_EXIT },
              }}
            >
              {activeGreeting.greeting}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <p className="sr-only" aria-live="polite">
          Opening portfolio introduction.
        </p>
      </div>
    </motion.div>
  )
}
