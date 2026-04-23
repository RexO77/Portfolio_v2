import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'
import { useInViewOnce } from '@/hooks/viewport'

type HighlightDirection = 'ltr' | 'rtl' | 'ttb' | 'btt'

type HighlightTransition = {
  type?: 'spring'
  duration?: number
  delay?: number
  bounce?: number
}

interface TextHighlighterProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  triggerType?: 'hover' | 'ref' | 'inView' | 'auto'
  transition?: HighlightTransition
  useInViewOptions?: IntersectionObserverInit
  className?: string
  highlightColor?: string
  direction?: HighlightDirection
}

export interface TextHighlighterRef {
  animate: (direction?: HighlightDirection) => void
  reset: () => void
}

function getBackgroundSize(animated: boolean, direction: HighlightDirection) {
  switch (direction) {
    case 'rtl':
      return animated ? '100% 100%' : '0% 100%'
    case 'ttb':
    case 'btt':
      return animated ? '100% 100%' : '100% 0%'
    case 'ltr':
    default:
      return animated ? '100% 100%' : '0% 100%'
  }
}

function getBackgroundPosition(direction: HighlightDirection) {
  switch (direction) {
    case 'rtl':
      return '100% 0%'
    case 'btt':
      return '0% 100%'
    case 'ttb':
    case 'ltr':
    default:
      return '0% 0%'
  }
}

export const TextHighlighter = forwardRef<TextHighlighterRef, TextHighlighterProps>(
  (
    {
      children,
      triggerType = 'inView',
      transition = { type: 'spring', duration: 1, delay: 0, bounce: 0 },
      useInViewOptions = {
        threshold: 0.1,
        rootMargin: '0px',
      },
      className,
      highlightColor = 'hsl(25, 90%, 80%)',
      direction = 'ltr',
      ...props
    },
    ref,
  ) => {
    const { ref: inViewRef, inView } =
      useInViewOnce<HTMLSpanElement>(useInViewOptions)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [currentDirection, setCurrentDirection] =
      useState<HighlightDirection>(direction)
    const [resetKey, setResetKey] = useState(0)

    useEffect(() => {
      setCurrentDirection(direction)
    }, [direction])

    useImperativeHandle(ref, () => ({
      animate: (nextDirection?: HighlightDirection) => {
        if (nextDirection) {
          setCurrentDirection(nextDirection)
        }
        setIsAnimating(true)
      },
      reset: () => {
        setIsAnimating(false)
        setResetKey((value) => value + 1)
      },
    }))

    const shouldAnimate =
      triggerType === 'hover'
        ? isHovered
        : triggerType === 'ref'
          ? isAnimating
          : triggerType === 'auto'
            ? true
            : inView

    const animatedSize = getBackgroundSize(shouldAnimate, currentDirection)
    const initialSize = getBackgroundSize(false, currentDirection)
    const backgroundPosition = getBackgroundPosition(currentDirection)

    return (
      <span
        ref={inViewRef}
        onMouseEnter={() => {
          if (triggerType === 'hover') {
            setIsHovered(true)
          }
        }}
        onMouseLeave={() => {
          if (triggerType === 'hover') {
            setIsHovered(false)
          }
        }}
        {...props}
      >
        <motion.span
          key={resetKey}
          className={cn('labs-text-highlighter', className)}
          style={{
            backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition,
            backgroundSize: animatedSize,
            boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone',
          }}
          animate={{ backgroundSize: animatedSize }}
          initial={{ backgroundSize: initialSize }}
          transition={transition}
        >
          {children}
        </motion.span>
      </span>
    )
  },
)

TextHighlighter.displayName = 'TextHighlighter'

export default TextHighlighter
