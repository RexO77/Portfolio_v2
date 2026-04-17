import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStartupAsset } from '@/features/intro/useStartupAsset'

interface ProjectCardProps {
  videoSrc?: string
  imageSrc?: string
  title: string
  description: string
  label?: string
  year?: string
  to?: string
  trackIntroLoad?: boolean
}

export function ProjectCard({
  videoSrc,
  imageSrc,
  title,
  description,
  label,
  year,
  to,
  trackIntroLoad = false,
}: ProjectCardProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const settleStartupAsset = useStartupAsset(
    trackIntroLoad && Boolean(videoSrc || imageSrc),
  )

  useEffect(() => {
    if (!trackIntroLoad) return

    if (imageRef.current?.complete) {
      settleStartupAsset()
      return
    }

    if (
      (videoRef.current?.readyState ?? 0) >=
      HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      settleStartupAsset()
    }
  }, [imageSrc, settleStartupAsset, trackIntroLoad, videoSrc])

  const media = videoSrc ? (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      poster={imageSrc}
      className="project-card__video"
      preload={trackIntroLoad ? 'auto' : 'metadata'}
      onLoadedData={settleStartupAsset}
      onError={settleStartupAsset}
    >
      <source src={videoSrc} />
    </video>
  ) : imageSrc ? (
    <img
      ref={imageRef}
      src={imageSrc}
      alt={title}
      className="project-card__image"
      loading={trackIntroLoad ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={trackIntroLoad ? 'high' : 'auto'}
      onLoad={settleStartupAsset}
      onError={settleStartupAsset}
    />
  ) : (
    <div className="project-card__placeholder" aria-hidden />
  )

  const header = (
    <div className="project-card__header">
      {year ? <span className="project-card__year">{year}</span> : null}
      <h3 className="project-card__title">{title}</h3>
      <p className="project-card__description">{description}</p>
      {label ? <span className="project-card__label">{label}</span> : null}
    </div>
  )

  const body = (
    <>
      {header}
      <div className="project-card__media">{media}</div>
    </>
  )

  if (!to) {
    return <section className="project-card">{body}</section>
  }

  return (
    <Link
      to={to}
      className="project-card project-card--link"
      aria-label={`${title} — ${description}`}
    >
      {body}
    </Link>
  )
}
