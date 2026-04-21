import { Link } from 'react-router-dom'
import { connectEmail, connectLinks, siteMetadata } from '@/content/site'

const footerLinks = [
  { label: 'Work', to: '/#work' },
  { label: 'Life', to: '/life' },
  { label: 'Blog', href: 'https://blog.nischalskanda.tech' },
  { label: 'Email', href: `mailto:${connectEmail}` },
] as const

const externalLinks = connectLinks.filter(
  (link) => link.kind === 'external' && link.href,
)

export function StickyFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="sticky-footer" aria-label="Site footer">
      <div className="sticky-footer__body">
        <div className="sticky-footer__top">
          <div className="sticky-footer__brand">
            <p className="sticky-footer__name">{siteMetadata.name}</p>
            <p className="sticky-footer__tagline">Design engineer and developer.</p>
          </div>

          <div className="sticky-footer__navs">
            <nav className="sticky-footer__links" aria-label="Footer navigation">
              {footerLinks.map((link) =>
                'to' in link ? (
                  <Link key={link.label} to={link.to} className="sticky-footer__link">
                    {link.label.toLowerCase()}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="sticky-footer__link"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      link.href.startsWith('http') ? 'noopener noreferrer' : undefined
                    }
                  >
                    {link.label.toLowerCase()}
                  </a>
                ),
              )}
            </nav>

            <nav
              className="sticky-footer__links sticky-footer__links--secondary"
              aria-label="Social links"
            >
              {externalLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="sticky-footer__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label.toLowerCase()}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <p className="sticky-footer__copyright">© {year}, {siteMetadata.name}</p>
      </div>
    </footer>
  )
}
