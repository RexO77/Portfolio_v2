'use client'

import { cn } from '@/lib/utils'
import { useHaptics } from '@/hooks/use-haptics'
import {
  AnimatePresence,
  MotionConfig,
  type MotionValue,
  motion,
  type Transition,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react'

export interface DynamicScrollIslandSection {
  id: string
  name: string
}

interface DynamicScrollIslandTOCProps {
  sections: DynamicScrollIslandSection[]
  containerRef?: RefObject<HTMLElement | null>
  containerSelector?: string
  className?: string
  layoutIdPrefix?: string
  scrollOffset?: number
  transition?: Transition
}

const shellKey = 'dynamic-scroll-island-shell'
const iconKey = 'dynamic-scroll-island-icon'
const textKey = 'dynamic-scroll-island-text'
const chevronKey = 'dynamic-scroll-island-chevron'
const listKey = 'dynamic-scroll-island-list'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getContainer(
  containerRef?: RefObject<HTMLElement | null>,
  containerSelector?: string,
) {
  if (containerRef?.current) {
    return containerRef.current
  }

  if (typeof document === 'undefined') {
    return null
  }

  return containerSelector
    ? document.querySelector<HTMLElement>(containerSelector)
    : null
}

export default function DynamicScrollIslandTOC({
  sections,
  containerRef,
  containerSelector,
  className,
  layoutIdPrefix = 'dynamic-scroll-island',
  scrollOffset = 104,
  transition = { type: 'spring', stiffness: 360, damping: 34, mass: 0.9 },
}: DynamicScrollIslandTOCProps) {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null)
  const progress = useMotionValue(0)
  const shouldReduceMotion = useReducedMotion()
  const { haptic } = useHaptics()
  const resolvedActiveId = useMemo(
    () =>
      sections.some((section) => section.id === activeId)
        ? activeId
        : sections[0]?.id ?? null,
    [activeId, sections],
  )

  const activeSection = useMemo(
    () =>
      sections.find((section) => section.id === resolvedActiveId) ?? sections[0] ?? null,
    [resolvedActiveId, sections],
  )

  const scrollToSection = useCallback(
    (section: DynamicScrollIslandSection) => {
      haptic('tab')

      const container = getContainer(containerRef, containerSelector)
      const target =
        typeof document !== 'undefined' ? document.getElementById(section.id) : null

      if (!container || !target) {
        return
      }

      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const nextTop =
        container.scrollTop + (targetRect.top - containerRect.top) - scrollOffset

      container.scrollTo({
        top: Math.max(0, nextTop),
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      })

      setActiveId(section.id)
      setOpen(false)
    },
    [containerRef, containerSelector, haptic, scrollOffset, shouldReduceMotion],
  )

  useEffect(() => {
    if (!sections.length || typeof window === 'undefined') {
      return undefined
    }

    const container = getContainer(containerRef, containerSelector)

    if (!container) {
      return undefined
    }

    let frame = 0

    const syncState = () => {
      frame = 0

      const maxScroll = Math.max(container.scrollHeight - container.clientHeight, 1)
      const nextProgress =
        container.scrollHeight <= container.clientHeight
          ? 1
          : clamp(container.scrollTop / maxScroll, 0, 1)

      progress.set(nextProgress)

      const containerTop = container.getBoundingClientRect().top
      const marker = scrollOffset + Math.min(container.clientHeight * 0.18, 120)
      let nextActive = sections[0]?.id ?? null

      for (const section of sections) {
        const target = document.getElementById(section.id)

        if (!target) {
          continue
        }

        const relativeTop = target.getBoundingClientRect().top - containerTop

        if (relativeTop <= marker) {
          nextActive = section.id
          continue
        }

        break
      }

      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 4) {
        nextActive = sections.at(-1)?.id ?? nextActive
      }

      setActiveId((current) => (current === nextActive ? current : nextActive))
    }

    const requestSync = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(syncState)
    }

    requestSync()

    container.addEventListener('scroll', requestSync, { passive: true })
    window.addEventListener('resize', requestSync)

    const resizeObserver = new ResizeObserver(requestSync)
    resizeObserver.observe(container)

    for (const section of sections) {
      const target = document.getElementById(section.id)

      if (target) {
        resizeObserver.observe(target)
      }
    }

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      container.removeEventListener('scroll', requestSync)
      window.removeEventListener('resize', requestSync)
      resizeObserver.disconnect()
    }
  }, [containerRef, containerSelector, progress, scrollOffset, sections])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  if (!sections.length || !activeSection) {
    return null
  }

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[90] flex justify-center px-4',
        className,
      )}
    >
      <MotionConfig transition={transition}>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.button
              type="button"
              aria-label="Close section navigator"
              onClick={() => {
                haptic('menu-close')
                setOpen(false)
              }}
              className="pointer-events-auto fixed inset-0 bg-d-fg/12 backdrop-blur-[4px]"
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            />
          ) : null}
        </AnimatePresence>

        <div className="pointer-events-auto relative [--toc-width:min(92vw,20rem)] [--toc-width-open:min(92vw,22rem)]">
          <AnimatePresence initial={false} mode="popLayout">
            {open ? (
              <motion.div
                key="open"
                layoutId={`${layoutIdPrefix}-${shellKey}`}
                style={{ borderRadius: 28 }}
                className="relative flex min-h-[17rem] w-[var(--toc-width-open)] flex-col overflow-hidden border border-d-bg/10 bg-d-fg/96 px-4 pb-4 pt-16 text-d-bg shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl"
              >
                <div className="absolute inset-x-4 top-4 flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <Header
                      activeSection={activeSection}
                      open={open}
                      progress={progress}
                      layoutIdPrefix={layoutIdPrefix}
                    />
                  </div>
                  <CloseButton
                    onClick={() => {
                      haptic('menu-close')
                      setOpen(false)
                    }}
                  />
                </div>

                <motion.div
                  layoutId={`${layoutIdPrefix}-${listKey}`}
                  layout="position"
                  className="flex max-h-[12rem] flex-col gap-1 overflow-y-auto pr-1"
                >
                  <Items
                    sections={sections}
                    activeId={activeId}
                    onSelect={scrollToSection}
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.button
                key="closed"
                type="button"
                layoutId={`${layoutIdPrefix}-${shellKey}`}
                style={{ borderRadius: 28 }}
                className="flex w-[var(--toc-width)] items-center gap-3 overflow-hidden border border-d-bg/10 bg-d-fg/96 px-3 py-2 text-d-bg shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                onClick={() => {
                  haptic('menu-open')
                  setOpen(true)
                }}
                aria-label="Open section navigator"
              >
                <div className="min-w-0 flex-1">
                  <Header
                    activeSection={activeSection}
                    open={open}
                    progress={progress}
                    layoutIdPrefix={layoutIdPrefix}
                  />
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </div>
  )
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close section navigator"
      className="inline-flex size-9 items-center justify-center rounded-full bg-d-bg/10 text-d-bg transition-colors hover:bg-d-bg/16"
    >
      <CloseGlyph />
    </button>
  )
}

function Items({
  sections,
  activeId,
  onSelect,
}: {
  sections: DynamicScrollIslandSection[]
  activeId: string | null
  onSelect: (section: DynamicScrollIslandSection) => void
}) {
  return (
    <>
      {sections.map((section) => {
        const isActive = section.id === activeId

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section)}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'flex items-center justify-between gap-4 rounded-2xl px-3 py-3 text-left transition-colors duration-200',
              isActive
                ? 'bg-d-bg/14 text-d-bg'
                : 'text-d-bg/70 hover:bg-d-bg/8 hover:text-d-bg',
            )}
          >
            <span className="truncate text-sm font-medium">{section.name}</span>
            <span
              className={cn(
                'size-2 rounded-full transition-colors',
                isActive ? 'bg-d-bg' : 'bg-d-bg/20',
              )}
            />
          </button>
        )
      })}
    </>
  )
}

function Header({
  activeSection,
  open,
  progress,
  layoutIdPrefix,
}: {
  activeSection: DynamicScrollIslandSection
  open: boolean
  progress: MotionValue<number>
  layoutIdPrefix: string
}) {
  const circumference = 2 * Math.PI * 10
  const dashOffset = useSpring(
    useTransform(progress, [0, 1], [circumference, 0]),
    { visualDuration: 0.18, bounce: 0 },
  )

  return (
    <div className="flex min-w-0 items-center gap-3">
      <motion.div layoutId={`${layoutIdPrefix}-${iconKey}`} className="shrink-0">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            strokeWidth="4"
            fill="none"
            className="stroke-white/18"
          />
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 12 12)"
            className="stroke-white/80"
          />
        </svg>
      </motion.div>

      <div className="min-w-0 flex-1">
        <motion.p
          layout="position"
          layoutId={`${layoutIdPrefix}-${textKey}`}
          className="truncate text-sm font-semibold text-d-bg"
        >
          {activeSection.name}
        </motion.p>
      </div>

      <motion.div
        layout="position"
        layoutId={`${layoutIdPrefix}-${chevronKey}`}
        animate={{ opacity: open ? 0 : 1, rotate: open ? 0 : 180 }}
        transition={{
          opacity: { duration: open ? 0.16 : 0.22, ease: [0.16, 1, 0.3, 1] },
        }}
        aria-hidden={open ? 'true' : undefined}
        className={cn(
          'shrink-0 text-d-bg/72',
          open && 'pointer-events-none',
        )}
      >
        <ChevronUpGlyph />
      </motion.div>
    </div>
  )
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChevronUpGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
      <path
        d="m6 14 6-6 6 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
