import { motion } from 'motion/react'
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'

const Z_INDEX_BASE = 100

type DragElementsProps = {
  children: ReactNode
  className?: string
  dragMomentum?: boolean
}

function splitLayoutStyle(style: CSSProperties | undefined): {
  outer: CSSProperties
  inner: CSSProperties
} {
  if (!style) return { outer: { position: 'absolute' }, inner: {} }
  const { left, top, right, bottom, zIndex, ...inner } = style
  const outer: CSSProperties = {
    position: 'absolute',
    left,
    top,
    right,
    bottom,
    zIndex,
  }
  return { outer, inner }
}

/**
 * Wraps each direct child in a draggable `motion.div`. Put `left` / `top` (and optional
 * `right` / `bottom` / `zIndex`) on the child’s `style`; other styles stay on the child.
 */
export default function DragElements({
  children,
  className,
  dragMomentum = true,
}: DragElementsProps) {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const zCounterRef = useRef(Z_INDEX_BASE)
  const [topZIndices, setTopZIndices] = useState<Record<string, number>>({})

  const bringToTop = useCallback((key: string) => {
    zCounterRef.current += 1
    const next = zCounterRef.current
    setTopZIndices((prev) => ({ ...prev, [key]: next }))
  }, [])

  return (
    <div
      ref={constraintsRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child

        const el = child as ReactElement<{ style?: CSSProperties; className?: string }>
        const { outer, inner } = splitLayoutStyle(el.props.style)
        const itemKey = String(el.key ?? index)
        const stackedZ = topZIndices[itemKey]
        const resolvedZ = stackedZ ?? outer.zIndex

        return (
          <motion.div
            key={itemKey}
            drag
            dragConstraints={constraintsRef}
            dragMomentum={dragMomentum}
            dragElastic={0.08}
            onPointerDown={() => bringToTop(itemKey)}
            whileDrag={{
              cursor: 'grabbing',
              scale: 1.02,
            }}
            style={{
              ...outer,
              zIndex: resolvedZ,
              cursor: 'grab',
              touchAction: 'none',
            }}
          >
            {cloneElement(el, {
              style: inner,
            })}
          </motion.div>
        )
      })}
    </div>
  )
}
