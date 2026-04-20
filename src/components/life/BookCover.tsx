import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { CloseIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

interface BookCoverProps {
  src: string
  largeSrc?: string
  title: string
  author?: string
  rotation?: number
  loading?: 'eager' | 'lazy'
  className?: string
}

export function BookCover({
  src,
  largeSrc,
  title,
  author,
  rotation = 0,
  loading = 'lazy',
  className,
}: BookCoverProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isExpanded) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false)
    }

    document.addEventListener('keydown', handleEscape)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [isExpanded])

  const hoverState = shouldReduceMotion
    ? undefined
    : { y: -6, rotate: rotation - 1.5, scale: 1.04 }

  return (
    <>
      <motion.button
        type="button"
        aria-label={`Open ${title}${author ? ` by ${author}` : ''}`}
        className={cn('book-cover', className)}
        style={{ rotate: `${rotation}deg` }}
        whileHover={hoverState}
        whileFocus={hoverState}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        onClick={() => setIsExpanded(true)}
      >
        <span className="book-cover__shadow" aria-hidden="true" />
        <span className="book-cover__shell">
          <span className="book-cover__spine" aria-hidden="true" />

          <span className="book-cover__art">
            {!imageLoaded && !imageError && (
              <span className="book-cover__skeleton" aria-hidden="true" />
            )}

            {!imageError ? (
              <img
                src={src}
                alt={title}
                className={cn(
                  'book-cover__image',
                  imageLoaded && 'book-cover__image--loaded',
                )}
                loading={loading}
                decoding="async"
                draggable={false}
                width={140}
                height={210}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true)
                  setImageLoaded(true)
                }}
              />
            ) : (
              <span className="book-cover__fallback">
                <span className="book-cover__fallback-title">{title}</span>
                {author && (
                  <span className="book-cover__fallback-author">{author}</span>
                )}
              </span>
            )}
          </span>

          <span className="book-cover__pages" aria-hidden="true" />
        </span>

        <span className="book-cover__label">{title}</span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="book-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${title}${author ? ` by ${author}` : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              className="book-modal__inner"
              initial={shouldReduceMotion ? false : { scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.94, opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="book-modal__close"
                aria-label="Close"
                onClick={() => setIsExpanded(false)}
              >
                <CloseIcon className="h-4 w-4" />
              </button>

              <div className="book-modal__art">
                <img
                  src={largeSrc || src}
                  alt={title}
                  className="book-modal__image"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="book-modal__meta">
                <p className="book-modal__title">{title}</p>
                {author && <p className="book-modal__author">{author}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default BookCover
