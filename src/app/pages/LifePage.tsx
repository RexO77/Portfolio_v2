import { useEffect, useMemo } from 'react'

import { Navbar } from '@/components/Navbar'
import DragElements from '@/components/fancy/blocks/drag-elements'
import { BookCover } from '@/components/life/BookCover'
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

  const { essay } = lifePageContent
  const books = essay.books
  const spotify = essay.spotify

  useEffect(() => {
    if (!books?.items.length) return

    const preloads = books.items.flatMap((book) => {
      const cover = new Image()
      cover.src = book.src
      const large = new Image()
      if (book.largeSrc) large.src = book.largeSrc
      return [cover, large]
    })

    return () => {
      preloads.forEach((img) => {
        img.src = ''
      })
    }
  }, [books])

  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1} className="life-page">
        <section className="life-page__stage" aria-label="Memories">
          <div className="life-page__title-layer" aria-hidden="true">
            <p className="life-page__title">
              {lifePageContent.titleLead}{' '}
              <strong>{lifePageContent.titleEmphasis}</strong>
            </p>
          </div>

          <div className="life-page__canvas">
            <DragElements dragMomentum={false}>
              {polaroids.map(
                ({ src, alt, index, rotation, width, height, left, top, z }) => {
                  const prioritizeImage = index < 2

                  return (
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
                          width={width - 8}
                          height={height - 28}
                          draggable={false}
                          loading={prioritizeImage ? 'eager' : 'lazy'}
                          decoding="async"
                          fetchPriority={prioritizeImage ? 'high' : 'auto'}
                        />
                      </div>
                    </div>
                  )
                },
              )}
            </DragElements>
          </div>
        </section>

        <section id="life-essay" className="life-essay" aria-labelledby="life-essay-title">
          <header className="life-essay__intro">
            <p className="life-essay__eyebrow">{essay.eyebrow}</p>
            <h1 id="life-essay-title" className="life-essay__title">
              {essay.titleLines.map((line) => (
                <span key={line} className="life-essay__title-line">
                  {line}
                </span>
              ))}
            </h1>
          </header>

          <figure className="life-essay__portrait">
            <div className="life-essay__portrait-frame">
              <img
                src={essay.portrait.src}
                alt={essay.portrait.alt}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="life-essay__portrait-caption">
              <span className="life-essay__portrait-meta">{essay.portrait.caption}</span>
            </figcaption>
          </figure>

          <div className="life-essay__body">
            {essay.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? 'life-essay__paragraph life-essay__paragraph--lead'
                    : 'life-essay__paragraph'
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {books && books.items.length > 0 && (
            <section className="life-books" aria-labelledby="life-books-title">
              <p id="life-books-title" className="life-books__eyebrow">
                {books.eyebrow}
              </p>

              <div className="life-books__shelf">
                {books.items.map((book, index) => {
                  const rotation = index === 0 ? -3 : index === 1 ? 1.5 : 4
                  return (
                    <BookCover
                      key={book.title}
                      {...book}
                      rotation={rotation}
                      loading={index < 2 ? 'eager' : 'lazy'}
                    />
                  )
                })}
              </div>

              <p className="life-books__caption">{books.caption}</p>
            </section>
          )}

          {spotify && spotify.items.length > 0 && (
            <section className="life-spotify" aria-labelledby="life-spotify-title">
              <p id="life-spotify-title" className="life-spotify__eyebrow">
                {spotify.eyebrow}
              </p>

              <div className="life-spotify__stack">
                {spotify.items.map((playlist) => (
                  <div key={playlist.embedUrl} className="life-spotify__card">
                    <iframe
                      src={playlist.embedUrl}
                      title={playlist.title}
                      width="100%"
                      height="352"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>

              {spotify.caption && (
                <p className="life-spotify__caption">{spotify.caption}</p>
              )}
            </section>
          )}

          <p className="life-essay__signoff">{essay.signoff}</p>
        </section>
      </main>
    </>
  )
}
