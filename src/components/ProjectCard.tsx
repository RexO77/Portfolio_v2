import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { Link } from 'react-router-dom'
import { useStartupAsset } from '@/features/intro/useStartupAsset'

function useFinePointer() {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const apply = () => setFine(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return fine
}

interface ProjectCardProps {
  videoSrc?: string
  imageSrc?: string
  title: string
  description: string
  label?: string
  role?: string
  timeline?: string
  tags?: string[]
  /** Short line on the desktop cursor chip; defaults to description */
  hoverSummary?: string
  to?: string
  trackIntroLoad?: boolean
}

export function ProjectCard({
  videoSrc,
  imageSrc,
  title,
  description,
  label,
  role,
  timeline,
  tags,
  hoverSummary,
  to,
  trackIntroLoad = false,
}: ProjectCardProps) {
  const panelId = useId()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [chipPos, setChipPos] = useState({ x: 0, y: 0 })
  const [chipVisible, setChipVisible] = useState(false)
  const finePointer = useFinePointer()
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const settleStartupAsset = useStartupAsset(trackIntroLoad && Boolean(videoSrc || imageSrc))

  const chipText = hoverSummary ?? description

  const onMediaMove = useCallback((e: ReactMouseEvent) => {
    setChipPos({ x: e.clientX, y: e.clientY })
  }, [])

  const onMediaEnter = useCallback(() => {
    if (finePointer) setChipVisible(true)
  }, [finePointer])

  const onMediaLeave = useCallback(() => {
    setChipVisible(false)
  }, [])

  useEffect(() => {
    if (!trackIntroLoad) {
      return
    }

    if (imageRef.current?.complete) {
      settleStartupAsset()
      return
    }

    if ((videoRef.current?.readyState ?? 0) >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      settleStartupAsset()
    }
  }, [imageSrc, settleStartupAsset, trackIntroLoad, videoSrc])

  const meta =
    role || timeline ? (
      <div className="project-card__meta">
        {role && (
          <span className="project-card__meta-item">
            <span className="project-card__meta-key">Role</span> {role}
          </span>
        )}
        {timeline && (
          <span className="project-card__meta-item">
            <span className="project-card__meta-key">Timeline</span>{' '}
            {timeline}
          </span>
        )}
      </div>
    ) : null

  const tagRow =
    tags && tags.length > 0 ? (
      <div className="project-card__tags">
        {tags.map((tag) => (
          <span key={tag} className="project-card__tag">
            {tag}
          </span>
        ))}
      </div>
    ) : null

  const detailBody = (
    <>
      {label && <span className="project-card__label">{label}</span>}
      <h3 className="project-card__title">{title}</h3>
      <p className="project-card__description">{description}</p>
      {meta}
      {tagRow}
    </>
  )

  const ctaRow = (
    <span className="project-card__cta">
      Read case study
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </span>
  )

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

  if (!to) {
    return (
      <section className="project-card project-card--static">
        <div className="project-card__media">{media}</div>
        <div className="project-card__details-inner">
          {detailBody}
          {ctaRow}
        </div>
      </section>
    )
  }

  return (
    <div
      className={`project-card ${mobileOpen ? 'project-card--mobile-open' : ''}`}
    >
      <Link
        to={to}
        className="project-card__media-link"
        onMouseEnter={onMediaEnter}
        onMouseLeave={onMediaLeave}
        onMouseMove={onMediaMove}
      >
        <span className="sr-only">
          {title}. {description}
        </span>
        <div className="project-card__media">{media}</div>

        <div className="project-card__overlay" aria-hidden>
          <div className="project-card__overlay-scrim" />
          <div className="project-card__overlay-content">
            <div className="project-card__details-inner">
              {detailBody}
              {ctaRow}
            </div>
          </div>
        </div>

        {finePointer && chipVisible && (
          <span
            className="project-card__cursor-chip"
            style={{ left: chipPos.x, top: chipPos.y }}
            aria-hidden
          >
            {chipText}
          </span>
        )}
      </Link>

      <div className="project-card__mobile">
        <button
          type="button"
          className="project-card__mobile-toggle"
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="project-card__mobile-title">{title}</span>
          <span className="project-card__mobile-hint" aria-hidden>
            {mobileOpen ? 'Close' : 'Details'}
          </span>
        </button>

        <div
          id={panelId}
          className="project-card__mobile-panel"
          hidden={!mobileOpen}
        >
          <div className="project-card__details-inner">{detailBody}</div>
          <Link to={to} className="project-card__mobile-cta">
            Open full case study
          </Link>
        </div>
      </div>
    </div>
  )
}
