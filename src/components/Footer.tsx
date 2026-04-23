import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import Gravity, {
  MatterBody,
  type GravityRef,
} from '@/components/fancy/physics/gravity'
import { connectEmail, connectLinks, siteMetadata } from '@/content/site'

const primaryLinks = [
  { label: 'Work', to: '/#work' },
  { label: 'Life', to: '/life' },
  { label: 'Labs', to: '/labs' },
  { label: 'Blog', href: 'https://blog.nischalskanda.tech' },
] as const

const secondaryLinks = [
  { key: 'email', label: 'Email', href: `mailto:${connectEmail}` },
  ...connectLinks
    .filter(
      (link): link is (typeof connectLinks)[number] & { href: string } =>
        link.kind === 'external' &&
        typeof link.href === 'string' &&
        ['github', 'linkedin', 'resume'].includes(link.key),
    )
    .map(({ key, label, href }) => ({
      key,
      label,
      href,
    })),
] as const

const gravityBlocks = [
  { label: 'Figma & Prototyping', x: '22%', y: 168, angle: -5, color: '#10b981' },
  { label: 'User Research', x: '52%', y: 172, angle: 3, color: '#8b5cf6' },
  { label: 'Usability Testing', x: '68%', y: 162, angle: -2, color: '#f43f5e' },
  { label: 'Design Systems', x: '12%', y: 185, angle: 4, color: '#0ea5e9' },
  { label: 'Workflows & IA', x: '40%', y: 192, angle: 2, color: '#f59e0b' },
  { label: 'Visual Design', x: '64%', y: 182, angle: -4, color: '#84cc16' },
  { label: 'Collaboration & Dev Handoff', x: '30%', y: 200, angle: 3, color: '#ec4899' },
  { label: 'AI & Discovery', x: '74%', y: 192, angle: -3, color: '#06b6d4' },
]

export function Footer() {
  const shouldReduceMotion = useReducedMotion()
  const gravityRef = useRef<GravityRef>(null)
  const gravityStageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldReduceMotion || !gravityStageRef.current) {
      gravityRef.current?.stop()
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          gravityRef.current?.start()
          return
        }

        gravityRef.current?.stop()
      },
      { threshold: 0.2 },
    )

    observer.observe(gravityStageRef.current)

    return () => {
      observer.disconnect()
    }
  }, [shouldReduceMotion])

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__line" aria-hidden="true" />

      <div ref={gravityStageRef} className="footer__gravity-stage">
        {/* Name + links sit at the top of the unified stage */}
        <div className="footer__overlay">
          <p className="footer__name">{siteMetadata.name}</p>

          <div className="footer__navs">
            <nav className="footer__links" aria-label="Footer navigation">
              {primaryLinks.map((link) =>
                'to' in link ? (
                  <Link key={link.label} to={link.to} className="footer__link">
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__link"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </nav>

            <nav
              className="footer__links footer__links--secondary"
              aria-label="External links"
            >
              {secondaryLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="footer__link"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Physics pills */}
        {shouldReduceMotion ? (
          <div className="footer__gravity-static" aria-hidden="true">
            {gravityBlocks.map((block) => (
              <div key={block.label} className="footer__gravity-block" style={{ background: block.color }}>
                {block.label}
              </div>
            ))}
          </div>
        ) : (
          <Gravity
            ref={gravityRef}
            autoStart={false}
            addTopWall={false}
            gravity={{ x: 0, y: 0.72 }}
            className="footer__gravity-scene"
            aria-hidden="true"
          >
            {gravityBlocks.map((block) => (
              <MatterBody
                key={block.label}
                x={block.x}
                y={block.y}
                angle={block.angle}
                className="footer__gravity-block-shell"
                matterBodyOptions={{
                  friction: 0.4,
                  restitution: 0.15,
                  density: 0.0011,
                }}
              >
                <div className="footer__gravity-block" style={{ background: block.color }}>{block.label}</div>
              </MatterBody>
            ))}
          </Gravity>
        )}

        {/* Visual ground line */}
        <div className="footer__ground" aria-hidden="true" />
      </div>
    </footer>
  )
}
