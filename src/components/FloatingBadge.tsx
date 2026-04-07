interface FloatingBadgeProps {
  label: string
  className?: string
  delay?: number
}

export function FloatingBadge({ label, className, delay = 2.1 }: FloatingBadgeProps) {
  return (
    <div
      className={`floating-badge ${className ?? ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="floating-badge__inner">
        <span className="floating-badge__text">{label}</span>
      </div>
    </div>
  )
}
