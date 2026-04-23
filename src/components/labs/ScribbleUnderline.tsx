import {
  useId,
  useState,
  type CSSProperties,
  type PropsWithChildren,
} from 'react'

import { useInViewOnce, usePrefersReducedMotion } from '@/hooks/viewport'

type TriggerMode = 'inView' | 'hover' | 'always' | 'controlled'

type ScribbleUnderlineProps = PropsWithChildren<{
  color?: string
  className?: string
  trigger?: TriggerMode
  display?: 'inline-block' | 'inline-flex'
  active?: boolean
}>

export function ScribbleUnderline({
  children,
  color = '#1d4ed8',
  className,
  trigger = 'inView',
  display = 'inline-block',
  active,
}: ScribbleUnderlineProps) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>()
  const reduceMotion = usePrefersReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const uniqueId = useId().replace(/:/g, '')
  const wobbleId = `${uniqueId}-scribble-wobble`
  const wobbleStrongId = `${uniqueId}-scribble-wobble-strong`

  const resolvedActive = reduceMotion
    ? true
    : trigger === 'hover'
      ? (active ?? isHovered)
      : trigger === 'always'
        ? true
        : trigger === 'controlled'
          ? Boolean(active)
          : inView

  const dashOffset = reduceMotion || resolvedActive ? 0 : 100
  const mainOpacity = reduceMotion || resolvedActive ? 1 : 0
  const defaultClassName = display === 'inline-flex' ? 'inline-flex' : 'inline-block'
  const spanClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName

  const baseStyle: CSSProperties = {
    position: 'relative',
    display,
    paddingBottom: '0.15em',
  }

  const enableHoverHandlers = trigger === 'hover' && active === undefined

  return (
    <span
      ref={ref}
      className={spanClassName}
      style={baseStyle}
      onMouseEnter={enableHoverHandlers ? () => setIsHovered(true) : undefined}
      onMouseLeave={enableHoverHandlers ? () => setIsHovered(false) : undefined}
      onFocus={enableHoverHandlers ? () => setIsHovered(true) : undefined}
      onBlur={enableHoverHandlers ? () => setIsHovered(false) : undefined}
    >
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '0.7em',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        <defs>
          <filter id={wobbleId} x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              baseFrequency="0.04 0.08"
              numOctaves="2"
              result="turbulence"
              seed="1"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="1.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id={wobbleStrongId} x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              baseFrequency="0.05 0.1"
              numOctaves="2"
              result="turbulence"
              seed="2"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <path
          d="M2,15 Q18,19 34,15 T66,15 T98,15"
          pathLength={100}
          style={{
            fill: 'none',
            stroke: color,
            strokeOpacity: 0.25,
            strokeWidth: 9,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            filter: `url(#${wobbleId})`,
            strokeDasharray: 100,
            strokeDashoffset: dashOffset,
            opacity: 0,
            transition:
              'stroke-dashoffset 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 420ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        <g
          style={{
            transformOrigin: '50px 10px',
            animation: reduceMotion
              ? undefined
              : 'labs-scribble-wiggle 6s ease-in-out infinite',
          }}
        >
          <path
            d="M2,14 Q18,18 34,14 T66,14 T98,14"
            pathLength={100}
            style={{
              fill: 'none',
              stroke: color,
              strokeWidth: 6,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              filter: `url(#${resolvedActive ? wobbleStrongId : wobbleId})`,
              strokeDasharray: 100,
              strokeDashoffset: dashOffset,
              opacity: mainOpacity,
              transition:
                'stroke-dashoffset 650ms cubic-bezier(0.16, 1, 0.3, 1) 40ms, opacity 420ms cubic-bezier(0.16, 1, 0.3, 1) 40ms',
            }}
          />
        </g>
      </svg>
    </span>
  )
}

export default ScribbleUnderline
