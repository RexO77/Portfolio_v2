import { useCallback } from 'react'
import { useReducedMotion } from 'motion/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DiscoverNav } from '@/components/ui/discover-nav'
import { navItems } from '@/content/site'
import { useIntroState } from '@/features/intro/useIntroState'

function getActiveNavTarget(pathname: string, hash: string) {
  if (pathname === '/life') {
    return '/life'
  }

  if (pathname.startsWith('/projects/')) {
    return '/#work'
  }

  if (pathname === '/' && hash) {
    return `/${hash}`
  }

  if (pathname === '/') {
    return '/#work'
  }

  return null
}

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const { introHandoffStarted, introComplete } = useIntroState()
  const activeItem = getActiveNavTarget(location.pathname, location.hash)

  const scrollToHash = useCallback(
    (hash: string) => {
      const scrollRoot = document.querySelector<HTMLElement>('.scroll-root')
      const target = scrollRoot?.querySelector<HTMLElement>(hash)

      if (!target) {
        return
      }

      target.scrollIntoView({
        block: 'start',
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      })
    },
    [shouldReduceMotion],
  )

  const handleSelect = useCallback(
    (item: (typeof navItems)[number]) => {
      if (item.kind === 'section') {
        const [, targetHash = ''] = item.to.split('#')
        const hash = `#${targetHash}`

        if (location.pathname === '/') {
          if (location.hash === hash) {
            scrollToHash(hash)
          } else {
            navigate({ pathname: '/', hash })
          }

          return
        }
      }

      navigate(item.to)
    },
    [location.hash, location.pathname, navigate, scrollToHash],
  )

  return (
    <header
      className={`navbar${
        !introComplete ? ' navbar--intro-pending' : ''
      }${introHandoffStarted ? ' navbar--intro-handoff' : ''}`}
    >
      <Link to="/" className="navbar__brand">
        <span className="navbar__logo">Nischal Skanda</span>
      </Link>
      <div className="navbar__nav-wrap">
        <DiscoverNav
          items={navItems}
          activeItem={activeItem}
          onSelect={handleSelect}
          className="ml-auto"
        />
      </div>
    </header>
  )
}
