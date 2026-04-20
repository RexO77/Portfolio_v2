import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react'

import { uiEase } from '@/lib/motion'
import { playDialTick } from '@/lib/ui-sound'
import type { WorkExperience } from '@/types/content'

interface ExperienceDialProps {
  items: WorkExperience[]
  /**
   * Pixels per calendar year. Larger = more drag travel per year.
   * With 3–4 years of data, 320 gives a comfortable scrub distance.
   */
  pxPerYear?: number
}

const DEFAULT_PX_PER_YEAR = 200

const QUARTER_LABELS = ['JAN', 'APR', 'JUL', 'OCT'] as const

const TITLE_TRANSITION = { duration: 0.45, ease: uiEase }
const SUB_TRANSITION   = { duration: 0.35, ease: uiEase }
const RANGE_SPRING = {
  type: 'spring',
  stiffness: 220,
  damping: 30,
  mass: 0.6,
} as const
const DRAG_TRANSITION = {
  power: 0.28,
  timeConstant: 420,
  bounceStiffness: 520,
  bounceDamping: 44,
} as const

/** Minimum ms between dial tick sounds. */
const TICK_MIN_INTERVAL_MS = 55

// ── Fractional-year helpers ─────────────────────────────────────────────────
// All positions are expressed as fractional calendar years, e.g. Aug 2025 =
// 2025 + (8-1)/12 ≈ 2025.583. This gives month-precise positioning without
// any floating-point surprises from raw pixel arithmetic.

function startFrac(item: WorkExperience) {
  return item.startYear + (item.startMonth - 1) / 12
}

function endFrac(item: WorkExperience, currentYear: number, currentMonth: number) {
  if (item.endYear === 'present') {
    return currentYear + (currentMonth - 1) / 12
  }
  return item.endYear + ((item.endMonth ?? 12) - 1) / 12
}

// ───────────────────────────────────────────────────────────────────────────

export function ExperienceDial({
  items,
  pxPerYear = DEFAULT_PX_PER_YEAR,
}: ExperienceDialProps) {
  const reducedMotion = useReducedMotion()
  const today         = useMemo(() => new Date(), [])
  const currentYear   = today.getFullYear()
  const currentMonth  = today.getMonth() + 1 // 1–12

  const viewportRef = useRef<HTMLDivElement>(null)
  const [viewportWidth, setViewportWidth] = useState(0)

  // Ruler bounds: snap to whole calendar years for clean labels + ticks.
  // Add 1 year of breathing room after the latest role so the range pill
  // never butts up against the ruler edge.
  const { rulerStartYear, rulerEndYear, span } = useMemo(() => {
    const rStart = Math.min(...items.map((i) => i.startYear))
    // Always leave a full year of breathing room AFTER today (or the latest
    // endYear, whichever is greater) so the pointer never bumps the right
    // edge when it's parked on the current role.
    const latestEnd = Math.max(
      ...items.map((i) => (i.endYear === 'present' ? currentYear : i.endYear)),
      currentYear,
    )
    const rEnd = latestEnd + 1
    return { rulerStartYear: rStart, rulerEndYear: rEnd, span: rEnd - rStart }
  }, [items, currentYear])

  const rulerWidth = span * pxPerYear

  useEffect(() => {
    const el = viewportRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setViewportWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Role resolution ──────────────────────────────────────────────────────────
  // We resolve a role from a 0–1 progress value. Progress maps linearly to
  // the fractional year range [rulerStartYear, rulerEndYear].
  //
  // Overlap logic: when multiple roles cover the same point, the LAST one
  // in the array wins (most recent role takes precedence — Talview intern
  // then full-time both show "Talview" correctly).
  //
  // Gap logic: when the pointer falls between two roles, we show the most
  // recent role that has already started (rather than jumping to index 0).

  const resolveIndex = useCallback(
    (p: number) => {
      const yearFloat = rulerStartYear + p * span

      // Exact match (last wins for overlapping roles)
      for (let i = items.length - 1; i >= 0; i--) {
        const sf = startFrac(items[i])
        const ef = endFrac(items[i], currentYear, currentMonth)
        if (yearFloat >= sf && yearFloat <= ef) return i
      }

      // Gap: show the last role whose start is behind the pointer
      let fallback = 0
      for (let i = 0; i < items.length; i++) {
        if (startFrac(items[i]) <= yearFloat) fallback = i
      }
      return fallback
    },
    [items, rulerStartYear, span, currentYear, currentMonth],
  )

  // Land the pointer a couple of months AFTER today so the initial view is
  // unambiguously inside the current role's active window — never on a
  // boundary between two Talview entries.
  const initialProgress = useMemo(() => {
    const todayFrac = currentYear + (currentMonth - 1) / 12
    const targetFrac = todayFrac + 2 / 12 // two months past today
    return Math.min(1, Math.max(0, (targetFrac - rulerStartYear) / span))
  }, [currentYear, currentMonth, rulerStartYear, span])

  const initialX  = -(rulerWidth * initialProgress)
  const x         = useMotionValue(initialX)
  const progress  = useTransform(
    x,
    (v) => Math.min(1, Math.max(0, -v / rulerWidth)),
  )

  // Ensure `x` is always pinned to the initial position on mount. This
  // protects against Strict-Mode / HMR cases where a previous session's
  // motion value could persist and leave the dial off-center.
  const didInitXRef = useRef(false)
  useEffect(() => {
    if (didInitXRef.current) return
    didInitXRef.current = true
    x.set(initialX)
  }, [x, initialX])

  const [activeIndex, setActiveIndex] = useState(() =>
    resolveIndex(initialProgress),
  )

  // Tick sound + role change on progress update
  const months = span * 12
  const lastMonthIndexRef = useRef<number | null>(null)
  const lastTickAtRef     = useRef(0)

  useMotionValueEvent(progress, 'change', (p) => {
    const next = resolveIndex(p)
    setActiveIndex((prev) => (prev === next ? prev : next))

    if (reducedMotion) return
    const monthIndex = Math.max(0, Math.min(months, Math.floor(p * months)))
    const prevMonth  = lastMonthIndexRef.current
    if (prevMonth === null) { lastMonthIndexRef.current = monthIndex; return }
    if (monthIndex === prevMonth) return
    lastMonthIndexRef.current = monthIndex

    const now = performance.now()
    if (now - lastTickAtRef.current < TICK_MIN_INTERVAL_MS) return
    lastTickAtRef.current = now

    const isMajor = monthIndex % 12 === 0
    playDialTick({
      strength: isMajor ? 'major' : 'minor',
      pitchCents: (Math.random() * 2 - 1) * 40,
      gain: isMajor ? 0.1 : 0.065,
    })
  })

  const [isDragging, setIsDragging] = useState(false)

  const active       = items[activeIndex]
  const activeSF     = startFrac(active)
  const activeEF     = endFrac(active, currentYear, currentMonth)
  const rangeLeftPx  = (activeSF - rulerStartYear) * pxPerYear
  const rangeWidthPx = (activeEF - activeSF) * pxPerYear

  // Tick marks: one per month across the full ruler
  const ticks = useMemo(
    () =>
      Array.from({ length: months + 1 }, (_, i) => ({
        i,
        major: i % 12 === 0,
        mid: i % 12 !== 0 && i % 6 === 0,
      })),
    [months],
  )

  // Axis labels — a year label every January plus quarterly month labels
  // (Apr, Jul, Oct) between years. This keeps the ruler reading "alive"
  // as you drag through gaps between roles instead of long dead stretches.
  const axisLabels = useMemo(() => {
    const out: Array<{
      key: string
      leftPct: number
      text: string
      isYear: boolean
      fracYear: number
    }> = []
    for (let m = 0; m <= months; m += 3) {
      const monthInYear = m % 12
      const year = rulerStartYear + Math.floor(m / 12)
      const isYear = monthInYear === 0
      out.push({
        key: `${year}-${monthInYear}`,
        leftPct: (m / months) * 100,
        text: isYear ? String(year) : QUARTER_LABELS[monthInYear / 3],
        isYear,
        fracYear: year + monthInYear / 12,
      })
    }
    return out
  }, [months, rulerStartYear])

  const titleVariants = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { y: '32%', opacity: 0, filter: 'blur(14px)' },
        animate: { y: '0%',  opacity: 1, filter: 'blur(0px)' },
        exit:    { y: '-32%', opacity: 0, filter: 'blur(14px)' },
      }

  return (
    <div
      className="experience-dial"
      data-accent={active.accent}
      data-dragging={isDragging ? 'true' : 'false'}
      data-sound="off"
      data-click-burst="off"
      aria-roledescription="experience dial"
    >
      <div className="experience-dial__eyebrow">
        <span className="experience-dial__rule" aria-hidden="true" />
        <span className="experience-dial__eyebrow-text">Experience</span>
        <span className="experience-dial__rule" aria-hidden="true" />
      </div>

      <div className="experience-dial__headline">
        <div className="experience-dial__glow-stage" aria-hidden="true">
          {(['green', 'yellow', 'blue', 'orange', 'purple', 'sand'] as const).map((accent) => (
            <span
              key={accent}
              className="experience-dial__glow"
              data-accent={accent}
              data-active={active.accent === accent ? 'true' : 'false'}
            />
          ))}
        </div>

        <div className="experience-dial__title-stage">
          <AnimatePresence initial={false}>
            <motion.h2
              key={active.id}
              className="experience-dial__title"
              initial={titleVariants.initial}
              animate={titleVariants.animate}
              exit={titleVariants.exit}
              transition={TITLE_TRANSITION}
            >
              {active.company}
            </motion.h2>
          </AnimatePresence>
        </div>

        <div className="experience-dial__role-stage">
          <AnimatePresence initial={false}>
            <motion.p
              key={`${active.id}-role`}
              className="experience-dial__role"
              initial={{ y: reducedMotion ? 0 : 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reducedMotion ? 0 : -10, opacity: 0 }}
              transition={SUB_TRANSITION}
            >
              <span>{active.role}</span>
              <span className="experience-dial__role-dot" aria-hidden="true" />
              <span>{active.period}</span>
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div
        className="experience-dial__viewport"
        ref={viewportRef}
        role="group"
        aria-label={`Drag to scrub career timeline from ${rulerStartYear} to present`}
      >
        <div className="experience-dial__pointer" aria-hidden="true">
          <svg
            className="experience-dial__pointer-arrow"
            viewBox="0 0 14 10"
            preserveAspectRatio="none"
          >
            <path d="M7 10 L0 0 L14 0 Z" fill="currentColor" />
          </svg>
          <span className="experience-dial__pointer-stem" />
        </div>

        <motion.div
          className="experience-dial__ruler"
          drag={reducedMotion ? false : 'x'}
          dragConstraints={{ left: -rulerWidth, right: 0 }}
          dragElastic={0.06}
          dragMomentum
          dragTransition={DRAG_TRANSITION}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          style={{ x, width: rulerWidth } as CSSProperties}
        >
          <motion.div
            className="experience-dial__range"
            initial={false}
            animate={{ left: rangeLeftPx, width: rangeWidthPx }}
            transition={reducedMotion ? { duration: 0 } : RANGE_SPRING}
            aria-hidden="true"
          />

          <div className="experience-dial__ticks" aria-hidden="true">
            {ticks.map((t) => (
              <span
                key={t.i}
                className="experience-dial__tick"
                data-major={t.major ? 'true' : 'false'}
                data-mid={t.mid ? 'true' : 'false'}
                style={{ left: `${(t.i / months) * 100}%` }}
              />
            ))}
          </div>

          <div className="experience-dial__years" aria-hidden="true">
            {axisLabels.map(({ key, leftPct, text, isYear, fracYear }) => {
              // Month labels sit inside the active role's span; year labels
              // light up when the active role touches that calendar year.
              const inRange = isYear
                ? fracYear >= Math.floor(activeSF) && fracYear <= Math.ceil(activeEF)
                : fracYear >= activeSF && fracYear <= activeEF
              return (
                <span
                  key={key}
                  className="experience-dial__year"
                  data-type={isYear ? 'year' : 'month'}
                  data-active={inRange ? 'true' : 'false'}
                  style={{ left: `${leftPct}%` }}
                >
                  {text}
                </span>
              )
            })}
          </div>
        </motion.div>

        <span
          aria-hidden="true"
          data-viewport-width={viewportWidth}
          style={{ display: 'none' }}
        />
      </div>

      <p className="experience-dial__sr-only" aria-live="polite">
        {`${active.role} at ${active.company}, ${active.period}.`}
      </p>
    </div>
  )
}

export default ExperienceDial
