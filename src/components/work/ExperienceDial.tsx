import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  AnimatePresence,
  motion,
  type MotionStyle,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react'

import { uiEase } from '@/lib/motion'
import { playDialTick } from '@/lib/ui-sound'
import type {
  WorkExperience,
  WorkExperienceTimelineYear,
} from '@/types/content'

interface ExperienceDialProps {
  items: WorkExperience[]
  timelineYears?: WorkExperienceTimelineYear[]
  /**
   * Pixels per calendar year. Larger = more drag travel per year.
   * With 3–4 years of data, 320 gives a comfortable scrub distance.
   */
  pxPerYear?: number
}

interface VisibleMonth {
  key: string
  year: number
  month: number
  slotIndex: number
  isYearStart: boolean
  isQuarterStart: boolean
}

interface PositionedItem {
  item: WorkExperience
  startIndex: number
  endExclusiveIndex: number
}

const DEFAULT_PX_PER_YEAR = 200

const MONTH_LABELS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const

const QUARTER_LABELS = ['JAN', 'APR', 'JUL', 'OCT'] as const
const MIN_PX_PER_VISIBLE_MONTH = 40

const TITLE_TRANSITION = { duration: 0.34, ease: uiEase }
const SUB_TRANSITION = { duration: 0.26, ease: uiEase }
const RANGE_SPRING = {
  type: 'spring',
  stiffness: 360,
  damping: 34,
  mass: 0.5,
} as const
const DRAG_TRANSITION = {
  power: 0.28,
  timeConstant: 420,
  bounceStiffness: 520,
  bounceDamping: 44,
} as const

/** Minimum ms between dial tick sounds. */
const TICK_MIN_INTERVAL_MS = 55

function monthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`
}

function nextMonth(year: number, month: number) {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 }
}

function resolveTimelineEndMonth(
  yearWindow: WorkExperienceTimelineYear,
  currentYear: number,
  currentMonth: number,
) {
  if (yearWindow.endMonth === 'present') {
    return yearWindow.year === currentYear ? currentMonth : 12
  }

  return yearWindow.endMonth
}

function buildVisibleMonths(
  items: WorkExperience[],
  timelineYears: WorkExperienceTimelineYear[] | undefined,
  currentYear: number,
  currentMonth: number,
) {
  const months: VisibleMonth[] = []

  if (timelineYears?.length) {
    const sortedYears = [...timelineYears].sort((a, b) => a.year - b.year)
    let slotIndex = 0

    for (const yearWindow of sortedYears) {
      const endMonth = resolveTimelineEndMonth(yearWindow, currentYear, currentMonth)

      for (let month = yearWindow.startMonth; month <= endMonth; month += 1) {
        months.push({
          key: monthKey(yearWindow.year, month),
          year: yearWindow.year,
          month,
          slotIndex,
          isYearStart: month === yearWindow.startMonth,
          isQuarterStart: month === 1 || month === 4 || month === 7 || month === 10,
        })
        slotIndex += 1
      }
    }

    return months
  }

  const startYear = Math.min(...items.map((item) => item.startYear))
  const endYear = Math.max(
    ...items.map((item) => (item.endYear === 'present' ? currentYear : item.endYear)),
    currentYear,
  )

  let slotIndex = 0
  for (let year = startYear; year <= endYear; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      months.push({
        key: monthKey(year, month),
        year,
        month,
        slotIndex,
        isYearStart: month === 1,
        isQuarterStart: month === 1 || month === 4 || month === 7 || month === 10,
      })
      slotIndex += 1
    }
  }

  return months
}

export function ExperienceDial({
  items,
  timelineYears,
  pxPerYear = DEFAULT_PX_PER_YEAR,
}: ExperienceDialProps) {
  const reducedMotion = useReducedMotion()
  const today = useMemo(() => new Date(), [])
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1 // 1–12

  const viewportRef = useRef<HTMLDivElement>(null)
  const [viewportWidth, setViewportWidth] = useState(0)

  const visibleMonths = useMemo(
    () => buildVisibleMonths(items, timelineYears, currentYear, currentMonth),
    [currentMonth, currentYear, items, timelineYears],
  )

  const monthIndexByKey = useMemo(
    () => new Map(visibleMonths.map((month) => [month.key, month.slotIndex])),
    [visibleMonths],
  )

  const firstVisibleMonth = visibleMonths[0]
  const lastVisibleMonth = visibleMonths.at(-1)

  const baselineYearCount = useMemo(() => {
    if (!firstVisibleMonth || !lastVisibleMonth) {
      return 1
    }

    return lastVisibleMonth.year - firstVisibleMonth.year + 1
  }, [firstVisibleMonth, lastVisibleMonth])

  const rulerWidth = Math.max(
    baselineYearCount * pxPerYear,
    visibleMonths.length * MIN_PX_PER_VISIBLE_MONTH,
  )
  const pxPerVisibleMonth = visibleMonths.length
    ? rulerWidth / visibleMonths.length
    : rulerWidth

  useEffect(() => {
    const el = viewportRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setViewportWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const positionedItems = useMemo<PositionedItem[]>(() => {
    return items.map((item) => {
      const startIndex =
        monthIndexByKey.get(monthKey(item.startYear, item.startMonth)) ?? 0

      let endExclusiveIndex = visibleMonths.length
      if (item.endYear !== 'present') {
        const { year, month } = nextMonth(item.endYear, item.endMonth ?? 12)
        endExclusiveIndex =
          monthIndexByKey.get(monthKey(year, month)) ?? visibleMonths.length
      }

      return {
        item,
        startIndex,
        endExclusiveIndex: Math.max(startIndex + 1, endExclusiveIndex),
      }
    })
  }, [items, monthIndexByKey, visibleMonths.length])

  const resolveIndex = useCallback(
    (p: number) => {
      const slotCount = Math.max(visibleMonths.length, 1)
      const slotIndex = Math.max(
        0,
        Math.min(slotCount - 1, Math.floor(p * slotCount)),
      )

      for (let i = positionedItems.length - 1; i >= 0; i -= 1) {
        const positionedItem = positionedItems[i]
        if (
          slotIndex >= positionedItem.startIndex &&
          slotIndex < positionedItem.endExclusiveIndex
        ) {
          return i
        }
      }

      let fallback = 0
      for (let i = 0; i < positionedItems.length; i += 1) {
        if (positionedItems[i].startIndex <= slotIndex) fallback = i
      }
      return fallback
    },
    [positionedItems, visibleMonths.length],
  )

  const initialProgress = useMemo(() => {
    const todayIndex =
      monthIndexByKey.get(monthKey(currentYear, currentMonth)) ??
      Math.max(visibleMonths.length - 1, 0)
    const targetIndex = Math.min(
      Math.max(visibleMonths.length - 1, 0),
      todayIndex + 2,
    )

    if (!visibleMonths.length) {
      return 0
    }

    return (targetIndex + 0.5) / visibleMonths.length
  }, [currentMonth, currentYear, monthIndexByKey, visibleMonths.length])

  const initialX = -(rulerWidth * initialProgress)
  const x = useMotionValue(initialX)
  const progress = useTransform(
    x,
    (value) => Math.min(1, Math.max(0, -value / rulerWidth)),
  )

  const didInitXRef = useRef(false)
  useEffect(() => {
    if (didInitXRef.current) return
    didInitXRef.current = true
    x.set(initialX)
  }, [x, initialX])

  const [activeIndex, setActiveIndex] = useState(() =>
    resolveIndex(initialProgress),
  )

  const lastMonthIndexRef = useRef<number | null>(null)
  const lastTickAtRef = useRef(0)

  useMotionValueEvent(progress, 'change', (p) => {
    const next = resolveIndex(p)
    setActiveIndex((prev) => (prev === next ? prev : next))

    if (reducedMotion) return

    const monthIndex = Math.max(
      0,
      Math.min(visibleMonths.length, Math.floor(p * visibleMonths.length)),
    )
    const prevMonth = lastMonthIndexRef.current
    if (prevMonth === null) {
      lastMonthIndexRef.current = monthIndex
      return
    }
    if (monthIndex === prevMonth) return
    lastMonthIndexRef.current = monthIndex

    const now = performance.now()
    if (now - lastTickAtRef.current < TICK_MIN_INTERVAL_MS) return
    lastTickAtRef.current = now

    const visibleMonth = visibleMonths[Math.min(monthIndex, visibleMonths.length - 1)]
    const isMajor = visibleMonth?.isYearStart ?? false

    playDialTick({
      strength: isMajor ? 'major' : 'minor',
      pitchCents: (Math.random() * 2 - 1) * 40,
      gain: isMajor ? 0.1 : 0.065,
    })
  })

  const [isDragging, setIsDragging] = useState(false)

  const activePosition = positionedItems[activeIndex]
  const active = activePosition.item
  const activeEndYear =
    active.endYear === 'present' ? currentYear : active.endYear
  const rangeLeftPx = activePosition.startIndex * pxPerVisibleMonth
  const rangeWidthPx = Math.max(
    pxPerVisibleMonth,
    (activePosition.endExclusiveIndex - activePosition.startIndex) *
      pxPerVisibleMonth,
  )

  const ticks = useMemo(() => {
    const boundaries = visibleMonths.map((month, index) => ({
      key: `tick-${month.key}`,
      leftPct: (index / Math.max(visibleMonths.length, 1)) * 100,
      major: month.isYearStart,
      mid: !month.isYearStart && month.isQuarterStart,
    }))

    boundaries.push({
      key: 'tick-end',
      leftPct: 100,
      major: false,
      mid: false,
    })

    return boundaries
  }, [visibleMonths])

  const axisLabels = useMemo(() => {
    const grouped = new Map<number, VisibleMonth[]>()

    for (const month of visibleMonths) {
      const existing = grouped.get(month.year)
      if (existing) {
        existing.push(month)
      } else {
        grouped.set(month.year, [month])
      }
    }

    const labels: Array<{
      key: string
      leftPct: number
      text: string
      type: 'year' | 'month'
      year: number
      slotIndex?: number
    }> = []

    for (const [year, months] of grouped.entries()) {
      const firstMonth = months[0]
      labels.push({
        key: `year-${year}`,
        leftPct:
          (firstMonth.slotIndex / Math.max(visibleMonths.length, 1)) * 100,
        text: String(year),
        type: 'year',
        year,
      })

      const isPartialYear = months.length < 12

      let labelMonths: VisibleMonth[]
      if (months.length <= 2) {
        labelMonths = months
      } else if (months.length <= 4) {
        labelMonths = [months[0], months.at(-1)!]
      } else if (months.length <= 6) {
        labelMonths = [months[0], months[Math.floor(months.length / 2)], months.at(-1)!]
      } else {
        labelMonths = months.filter(
          (month) => month.month === 4 || month.month === 7 || month.month === 10,
        )
      }

      if (isPartialYear && labelMonths.length > 1) {
        labelMonths = labelMonths.filter((month) => month.month !== 12)
      }

      if (
        isPartialYear &&
        months[0]?.month === 1 &&
        labelMonths.length > 1 &&
        labelMonths[0]?.month === 1 &&
        months[1]
      ) {
        labelMonths = [months[1], ...labelMonths.slice(1)]
      }

      labelMonths = labelMonths.filter(
        (month, index, arr) => arr.findIndex((candidate) => candidate.key === month.key) === index,
      )

      for (const month of labelMonths) {
        labels.push({
          key: `month-${month.key}`,
          leftPct:
            ((month.slotIndex + 0.5) / Math.max(visibleMonths.length, 1)) * 100,
          text:
            months.length > 6
              ? QUARTER_LABELS[Math.floor((month.month - 1) / 3)]
              : MONTH_LABELS[month.month - 1],
          type: 'month',
          year,
          slotIndex: month.slotIndex,
        })
      }
    }

    return labels
  }, [visibleMonths])

  const titleVariants = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { y: '32%', opacity: 0, filter: 'blur(14px)' },
        animate: { y: '0%', opacity: 1, filter: 'blur(0px)' },
        exit: { y: '-32%', opacity: 0, filter: 'blur(14px)' },
      }

  const timelineStartLabel = firstVisibleMonth
    ? `${MONTH_LABELS[firstVisibleMonth.month - 1]} ${firstVisibleMonth.year}`
    : 'start'
  const timelineEndLabel =
    lastVisibleMonth &&
    lastVisibleMonth.year === currentYear &&
    lastVisibleMonth.month === currentMonth
      ? 'present'
      : lastVisibleMonth
        ? `${MONTH_LABELS[lastVisibleMonth.month - 1]} ${lastVisibleMonth.year}`
        : 'present'

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
          {(['green', 'yellow', 'blue', 'orange', 'purple', 'sand'] as const).map(
            (accent) => (
              <span
                key={accent}
                className="experience-dial__glow"
                data-accent={accent}
                data-active={active.accent === accent ? 'true' : 'false'}
              />
            ),
          )}
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
        aria-label={`Drag to scrub career timeline from ${timelineStartLabel} to ${timelineEndLabel}`}
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
          style={{ x, width: rulerWidth } satisfies MotionStyle}
        >
          <motion.div
            className="experience-dial__range"
            initial={false}
            animate={{ left: rangeLeftPx, width: rangeWidthPx }}
            transition={reducedMotion ? { duration: 0 } : RANGE_SPRING}
            aria-hidden="true"
          />

          <div className="experience-dial__ticks" aria-hidden="true">
            {ticks.map((tick) => (
              <span
                key={tick.key}
                className="experience-dial__tick"
                data-major={tick.major ? 'true' : 'false'}
                data-mid={tick.mid ? 'true' : 'false'}
                style={{ left: `${tick.leftPct}%` }}
              />
            ))}
          </div>

          <div className="experience-dial__years" aria-hidden="true">
            {axisLabels.map((label) => {
              const inRange =
                label.type === 'year'
                  ? label.year >= active.startYear && label.year <= activeEndYear
                  : label.slotIndex !== undefined &&
                    label.slotIndex >= activePosition.startIndex &&
                    label.slotIndex < activePosition.endExclusiveIndex

              return (
                <span
                  key={label.key}
                  className="experience-dial__year"
                  data-type={label.type}
                  data-active={inRange ? 'true' : 'false'}
                  style={{ left: `${label.leftPct}%` }}
                >
                  {label.text}
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
