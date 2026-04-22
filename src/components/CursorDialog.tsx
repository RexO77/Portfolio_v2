import { useEffect } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

import { uiEase } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface CursorDialogPoint {
  x: number
  y: number
}

interface CursorDialogProps {
  label: string
  visible: boolean
  point: CursorDialogPoint
  className?: string
}

interface ResolveCursorDialogPointOptions {
  clientX: number
  clientY: number
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>
  offsetY?: number
  safeX?: number
  safeTop?: number
  safeBottom?: number
}

const FOLLOW_SPRING = {
  stiffness: 420,
  damping: 40,
  mass: 0.7,
} as const

const REDUCED_FOLLOW_SPRING = {
  stiffness: 1000,
  damping: 120,
  mass: 1,
} as const

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function resolveCursorDialogPoint({
  clientX,
  clientY,
  rect,
  offsetY = 24,
  safeX = 112,
  safeTop = 10,
  safeBottom = 68,
}: ResolveCursorDialogPointOptions): CursorDialogPoint {
  const rawX = clientX - rect.left
  const rawY = clientY - rect.top + offsetY

  const insetX = Math.min(safeX, Math.max(24, rect.width / 2))
  const maxX = Math.max(insetX, rect.width - insetX)
  const maxY = Math.max(safeTop, rect.height - safeBottom)

  return {
    x: clamp(rawX, insetX, maxX),
    y: clamp(rawY, safeTop, maxY),
  }
}

export function CursorDialog({
  label,
  visible,
  point,
  className,
}: CursorDialogProps) {
  const reducedMotion = useReducedMotion()
  const left = useMotionValue(point.x)
  const top = useMotionValue(point.y)
  const smoothLeft = useSpring(
    left,
    reducedMotion ? REDUCED_FOLLOW_SPRING : FOLLOW_SPRING,
  )
  const smoothTop = useSpring(
    top,
    reducedMotion ? REDUCED_FOLLOW_SPRING : FOLLOW_SPRING,
  )

  useEffect(() => {
    left.set(point.x)
    top.set(point.y)
  }, [left, point.x, point.y, top])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          aria-hidden="true"
          className={cn('cursor-dialog', className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.14 : 0.18, ease: uiEase }}
          style={{ left: smoothLeft, top: smoothTop }}
        >
          <div className="cursor-dialog__bubble">
            <span className="cursor-dialog__text">{label}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
