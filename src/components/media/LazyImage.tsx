interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
}: LazyImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
    />
  )
}
