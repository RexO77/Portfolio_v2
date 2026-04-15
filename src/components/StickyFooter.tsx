import { Link } from 'react-router-dom'
import { footerNavItems, socialLinks, siteMetadata } from '@/content/site'

export function StickyFooter() {
  const firstName = siteMetadata.name.split(' ')[0]

  return (
    <footer className="sticky-footer" aria-label="Site footer">
      <div className="sticky-footer__inner">
        <nav className="sticky-footer__links" aria-label="Footer navigation">
          <ul>
            {footerNavItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="sticky-footer__link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul>
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  className="sticky-footer__link"
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="sticky-footer__wordmark" aria-hidden="true">
          {firstName}
        </p>
      </div>
    </footer>
  )
}
