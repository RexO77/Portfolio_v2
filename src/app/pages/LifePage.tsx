import { useMemo } from 'react'

import { Navbar } from '@/components/Navbar'
import DragElements from '@/components/fancy/blocks/drag-elements'
import { useStartupRouteReady } from '@/features/intro/useStartupRouteReady'
import useScreenSize from '@/hooks/use-screen-size'
import '@/styles/life-page.css'

const PHOTO_URLS = [
  'https://images.unsplash.com/photo-1683746531526-3bca2bc901b8?q=80&w=1820&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1631561729243-9b3291efceae?q=80&w=1885&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1635434002329-8ab192fe01e1?q=80&w=2828&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1719586799413-3f42bb2a132d?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1720561467986-ca3d408ca30b?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1724403124996-64115f38cd3f?q=80&w=3082&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

/** Stable “random” layout from index (avoids Strict Mode / resize flicker). */
function polaroidLayout(index: number, compact: boolean) {
  const rotation = ((index * 7 + 3) % 25) - 12
  const width = compact ? 90 + (index * 5) % 31 : 120 + (index * 7) % 31
  const height = compact ? 120 + (index * 3) % 21 : 150 + (index * 5) % 31
  return { rotation, width, height }
}

const PHOTO_POSITIONS: { left: string; top: string; z?: number }[] = [
  { left: '6%', top: '12%', z: 2 },
  { left: '58%', top: '8%', z: 3 },
  { left: '38%', top: '42%', z: 4 },
  { left: '72%', top: '48%', z: 2 },
  { left: '12%', top: '58%', z: 3 },
  { left: '48%', top: '72%', z: 2 },
]

const NOTE_BLOCKS: {
  left: string
  top: string
  z?: number
  label: string
  body: string
}[] = [
  {
    left: '22%',
    top: '22%',
    z: 5,
    label: 'Now',
    body: 'This is a loose scrapbook of places, light, and everyday moments. Swap the copy and images for your own story.',
  },
  {
    left: '62%',
    top: '28%',
    z: 5,
    label: 'How to read',
    body: 'Drag any photo or note. Stack them, uncover the center title, or arrange a little scene—there is no correct order.',
  },
  {
    left: '18%',
    top: '38%',
    z: 5,
    label: 'Colophon',
    body: 'Replace the Unsplash URLs in LifePage with your own files under src/assets when you are ready.',
  },
]

export default function LifePage() {
  const screenSize = useScreenSize()
  const compact = screenSize.lessThan('md')

  useStartupRouteReady()

  const polaroids = useMemo(
    () =>
      PHOTO_URLS.map((url, index) => {
        const { rotation, width, height } = polaroidLayout(index, compact)
        const pos = PHOTO_POSITIONS[index] ?? { left: '10%', top: '10%' }
        return { url, index, rotation, width, height, pos }
      }),
    [compact],
  )

  return (
    <div className="life-page">
      <Navbar />

      <div className="life-page__title-layer" aria-hidden="true">
        <p className="life-page__title">
          all your <strong>memories.</strong>
        </p>
      </div>

      <p className="life-page__hint">Drag photos and notes</p>

      <div className="life-page__canvas">
        <DragElements dragMomentum={false}>
          {polaroids.map(({ url, index, rotation, width, height, pos }) => (
            <div
              key={url}
              className="life-polaroid"
              style={{
                left: pos.left,
                top: pos.top,
                zIndex: pos.z,
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
                  src={url}
                  alt={`Memory ${index + 1}`}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          ))}

          {NOTE_BLOCKS.map((note) => (
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
