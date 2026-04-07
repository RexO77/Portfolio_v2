import { useRef, useEffect, useState } from 'react'

interface LazyVideoProps {
  src: string
  poster?: string
  className?: string
  loop?: boolean
  muted?: boolean
}

export function LazyVideo({
  src,
  poster,
  className,
  loop = true,
  muted = true,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible && ref.current) {
      ref.current.play().catch(() => {})
    }
  }, [isVisible])

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      loop={loop}
      muted={muted}
      playsInline
      preload="none"
      {...(isVisible ? { src } : {})}
    />
  )
}
