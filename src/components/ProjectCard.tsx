interface ProjectCardProps {
  videoSrc?: string
  imageSrc?: string
  title: string
  description: string
}

export function ProjectCard({
  videoSrc,
  imageSrc,
  title,
  description,
}: ProjectCardProps) {
  return (
    <section className="project-card">
      <div className="project-card__media">
        {videoSrc ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="project-card__video"
          >
            <source src={videoSrc} />
          </video>
        ) : imageSrc ? (
          <div className="project-card__image-wrapper">
            <img
              src={imageSrc}
              alt={title}
              className="project-card__image"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="project-card__placeholder" />
        )}
      </div>
      <p className="project-card__description">{description}</p>
    </section>
  )
}
