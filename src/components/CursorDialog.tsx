import { useEffect } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'

import type { CursorDialogPoint } from '@/lib/cursor-dialog'
import { cn } from '@/lib/utils'

interface CursorDialogProps {
  label: string
  visible: boolean
  point: CursorDialogPoint
  className?: string
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

export function CursorDialog({
  label,
  visible,
  point,
  className,
}: CursorDialogProps) {
  const reducedMotion = useReducedMotion()
  const dialogTransition = reducedMotion
    ? { duration: 0.12, ease: 'linear' as const }
    : { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const }
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
          initial={{
            opacity: 0,
            scale: reducedMotion ? 1 : 0.96,
            y: reducedMotion ? 0 : 12,
          }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{
            opacity: 0,
            scale: reducedMotion ? 1 : 0.985,
            y: reducedMotion ? 0 : 8,
          }}
          transition={dialogTransition}
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
