import { useMemo } from 'react'

import { Navbar } from '@/components/Navbar'
import DragElements from '@/components/fancy/blocks/drag-elements'
import { lifePageContent } from '@/content/life'
import { useStartupRouteReady } from '@/features/intro/useStartupRouteReady'
import { useMediaQuery } from '@/hooks/use-media-query'
import '@/styles/life-page.css'

/** Stable “random” layout from index (avoids Strict Mode / resize flicker). */
function polaroidLayout(index: number, compact: boolean) {
  const rotation = ((index * 7 + 3) % 25) - 12
  const width = compact ? 90 + (index * 5) % 31 : 120 + (index * 7) % 31
  const height = compact ? 120 + (index * 3) % 21 : 150 + (index * 5) % 31
  return { rotation, width, height }
}


export default function LifePage() {
  const compact = useMediaQuery('(max-width: 767px)')

  useStartupRouteReady()

  const polaroids = useMemo(
    () =>
      lifePageContent.photos.map((photo, index) => {
        const { rotation, width, height } = polaroidLayout(index, compact)
        return { ...photo, index, rotation, width, height }
      }),
    [compact],
  )

  return (
    <div className="life-page">
      <Navbar />

      <div className="life-page__title-layer" aria-hidden="true">
        <p className="life-page__title">
          {lifePageContent.titleLead} <strong>{lifePageContent.titleEmphasis}</strong>
        </p>
      </div>

      <p className="life-page__hint">{lifePageContent.hint}</p>

      <div className="life-page__canvas">
        <DragElements dragMomentum={false}>
          {polaroids.map(({ src, alt, rotation, width, height, left, top, z }) => (
            <div
              key={src}
              className="life-polaroid"
              style={{
                left,
                top,
                zIndex: z,
                width: `${width}px`,
                height: `${height}px`,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <div
                className="life-polaroid__frame"
                style={{
                  width: `${width - 8}px`,
                  height: `${height - 28}px`,
                }}
              >
                <img
                  src={src}
                  alt={alt}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          ))}

          {lifePageContent.notes.map((note) => (
            <div
              key={note.label}
              className="life-note"
              style={{
                left: note.left,
                top: note.top,
                zIndex: note.z,
                transform: `rotate(${((note.label.length * 2) % 9) - 4}deg)`,
              }}
            >
              <p className="life-note__label">{note.label}</p>
              <p className="life-note__body">{note.body}</p>
            </div>
          ))}
        </DragElements>
      </div>
    </div>
  )
}
