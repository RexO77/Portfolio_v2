import { useEffect, useState } from 'react'

const MD_MIN = 768

/**
 * Tracks viewport width vs a simple `md` breakpoint (768px), matching tokens.css.
 */
export default function useScreenSize() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : MD_MIN,
  )

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    width,
    lessThan(breakpoint: 'md') {
      return breakpoint === 'md' ? width < MD_MIN : width < MD_MIN
    },
  }
}
