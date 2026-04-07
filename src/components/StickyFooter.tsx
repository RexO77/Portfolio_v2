import { navItems, socialLinks, siteMetadata } from '@/content/site'

export function StickyFooter() {
  const firstName = siteMetadata.name.split(' ')[0]

  return (
    <footer className="sticky-footer" aria-label="Site footer">
      <div className="sticky-footer__inner">
        <nav className="sticky-footer__links" aria-label="Footer navigation">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="sticky-footer__link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ul>
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  className="sticky-footer__link"
                  target="_blank"
                  rel="noopener noreferrer"
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
