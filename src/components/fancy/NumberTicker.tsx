import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import {
  animate,
  type AnimationPlaybackControls,
  motion,
  useMotionValue,
  useTransform,
  type ValueAnimationTransition,
} from 'motion/react'

interface NumberTickerProps {
  from: number
  target: number
  transition?: ValueAnimationTransition
  className?: string
  onStart?: () => void
  onComplete?: () => void
  autoStart?: boolean
  decimalPlaces?: number
}

export interface NumberTickerRef {
  startAnimation: () => void
}

const NumberTicker = forwardRef<NumberTickerRef, NumberTickerProps>(
  (
    {
      from = 0,
      target = 100,
      transition = {
        duration: 3,
        type: 'tween',
        ease: 'easeInOut',
      },
      className,
      onStart,
      onComplete,
      autoStart = true,
      decimalPlaces = 0,
      ...props
    },
    ref,
  ) => {
    const count = useMotionValue(from)
    const formatted = useTransform(count, (latest) =>
      decimalPlaces > 0
        ? latest.toFixed(decimalPlaces)
        : Math.round(latest).toString(),
    )
    const [controls, setControls] = useState<AnimationPlaybackControls | null>(
      null,
    )

    const startAnimation = useCallback(() => {
      if (controls) controls.stop()
      onStart?.()

      count.set(from)

      const newControls = animate(count, target, {
        ...transition,
        onComplete: () => {
          onComplete?.()
        },
      })
      setControls(newControls)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useImperativeHandle(ref, () => ({
      startAnimation,
    }))

    useEffect(() => {
      if (autoStart) {
        startAnimation()
      }
      return () => controls?.stop()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoStart, startAnimation])

    return (
      <motion.span className={`tabular-nums${className ? ` ${className}` : ''}`} {...props}>
        {formatted}
      </motion.span>
    )
  },
)

NumberTicker.displayName = 'NumberTicker'

export default NumberTicker
