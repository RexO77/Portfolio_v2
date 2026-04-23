import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent,
} from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { Check, Copy } from '@/components/icons'
import { uiEase } from '@/lib/motion'

interface InteractionShowcaseProps {
  id: string
  title: string
  description?: string
  children: ReactNode
  code: string
  language?: string
}

const SLIDER_MIN = 0
const SLIDER_MAX = 100

export function InteractionShowcase({
  id,
  title,
  description,
  children,
  code,
  language = 'tsx',
}: InteractionShowcaseProps) {
  const [sliderPosition, setSliderPosition] = useState(80)
  const [isDragging, setIsDragging] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const codeScrollerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const setSliderFromClientX = (clientX: number) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percentage = Math.round((x / rect.width) * 100)
    setSliderPosition(Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, percentage)))
  }

  const handleSliderPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
    setSliderFromClientX(event.clientX)
  }

  const handleSliderKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      ![
        'ArrowLeft',
        'ArrowRight',
        'ArrowDown',
        'ArrowUp',
        'Home',
        'End',
      ].includes(event.key)
    ) {
      return
    }

    event.preventDefault()

    if (event.key === 'Home') {
      setSliderPosition(SLIDER_MIN)
      return
    }

    if (event.key === 'End') {
      setSliderPosition(SLIDER_MAX)
      return
    }

    const delta =
      event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -4 : 4

    setSliderPosition((value) =>
      Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, value + delta))
    )
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)

      window.setTimeout(() => {
        setIsCopied(false)
      }, 1800)
    } catch (error) {
      console.error('Failed to copy labs snippet:', error)
    }
  }

  const handleViewportWheel = (event: WheelEvent<HTMLDivElement>) => {
    const container = containerRef.current
    const scroller = codeScrollerRef.current
    if (!container || !scroller) return

    const rect = container.getBoundingClientRect()
    const splitX = rect.left + rect.width * (sliderPosition / 100)
    const isOverVisibleCode = event.clientX >= splitX

    if (!isOverVisibleCode) return

    const previousTop = scroller.scrollTop
    const previousLeft = scroller.scrollLeft

    scroller.scrollTop += event.deltaY
    scroller.scrollLeft += event.deltaX

    const didScroll =
      scroller.scrollTop !== previousTop || scroller.scrollLeft !== previousLeft

    if (didScroll) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  useEffect(() => {
    if (!isDragging) return undefined

    const handlePointerMove = (event: PointerEvent) => {
      setSliderFromClientX(event.clientX)
    }

    const handlePointerUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [isDragging])

  const highlightedCode = useMemo(
    () =>
      code.split('\n').map((line, index) => (
        <div className="labs-showcase__code-row" key={`${index}-${line}`}>
          <span className="labs-showcase__line-number">{index + 1}</span>
          <span className="labs-showcase__line-code">{line}</span>
        </div>
      )),
    [code]
  )

  return (
    <section className="labs-showcase" id={id}>
      <div className="labs-showcase__copy">
        <h2 className="labs-showcase__title">{title}</h2>
        {description ? (
          <p className="labs-showcase__description">{description}</p>
        ) : null}
      </div>

      <div
        ref={containerRef}
        className="labs-showcase__viewport"
        onWheel={handleViewportWheel}
      >
        <div className="labs-showcase__panel labs-showcase__panel--code">
          <div className="labs-showcase__panel-actions">
            <motion.button
              type="button"
              className="labs-showcase__copy-button"
              aria-label={`Copy ${language} code for ${title}`}
              title={isCopied ? 'Copied' : 'Copy code'}
              onClick={handleCopy}
              animate={{
                scale: isCopied && !shouldReduceMotion ? [1, 0.94, 1] : 1,
              }}
              transition={{ duration: 0.24, ease: uiEase }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            >
              <motion.span
                key={isCopied ? 'check' : 'copy'}
                className="labs-showcase__copy-button-icon"
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, scale: 0.72 }
                }
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18, ease: uiEase }}
              >
                {isCopied ? (
                  <Check aria-hidden="true" />
                ) : (
                  <Copy aria-hidden="true" />
                )}
              </motion.span>
            </motion.button>
          </div>

          <div ref={codeScrollerRef} className="labs-showcase__code-scroller">
            <div className="labs-showcase__code-table">{highlightedCode}</div>
          </div>
        </div>

        <div
          className="labs-showcase__panel labs-showcase__panel--preview"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <div className="labs-showcase__preview-content">{children}</div>
        </div>

        <button
          type="button"
          className="labs-showcase__divider"
          style={{ left: `${sliderPosition}%` }}
          onPointerDown={handleSliderPointerDown}
          onKeyDown={handleSliderKeyDown}
          role="slider"
          aria-label={`Adjust ${title} preview and code split`}
          aria-valuemin={SLIDER_MIN}
          aria-valuemax={SLIDER_MAX}
          aria-valuenow={sliderPosition}
        >
          <span className="labs-showcase__divider-knob" />
        </button>
      </div>
    </section>
  )
}

export default InteractionShowcase
