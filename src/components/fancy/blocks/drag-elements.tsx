import { motion } from 'motion/react'
import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'

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

        return (
          <motion.div
            key={el.key ?? index}
            drag
            dragConstraints={constraintsRef}
            dragMomentum={dragMomentum}
            dragElastic={0.08}
            whileDrag={{
              zIndex: 80,
              cursor: 'grabbing',
              scale: 1.02,
            }}
            style={{
              ...outer,
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
