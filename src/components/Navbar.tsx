import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DiscoverNav, type DiscoverNavItem } from '@/components/ui/discover-nav'
import { ConnectDropdown } from '@/components/ConnectDropdown'
import {
  Check,
  CloseIcon,
  ExternalLink,
  FileText,
  GitHub,
  LinkedIn,
  Mail,
  MenuIcon,
  Twitter,
} from '@/components/icons'
import { connectEmail, connectLinks, navItems } from '@/content/site'
import { useIntroState } from '@/features/intro/useIntroState'
import { useCopyText } from '@/hooks/use-copy-text'
import { useHaptics } from '@/hooks/use-haptics'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

const MOBILE_SOCIAL_ICONS: Record<string, ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  github: <GitHub className="h-4 w-4" />,
  linkedin: <LinkedIn className="h-4 w-4" />,
  resume: <FileText className="h-4 w-4" />,
}

function getActiveNavTarget(pathname: string, hash: string) {
  if (pathname === '/life') {
    return '/life'
  }

  if (pathname === '/labs') {
    return '/labs'
  }

  if (pathname === '/' && hash) {
    return `/${hash}`
  }

  return null
}

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const isMobileViewport = useMediaQuery('(max-width: 900px)')
  const { introHandoffStarted, introComplete } = useIntroState()
  const { haptic } = useHaptics()
  const activeItem = getActiveNavTarget(location.pathname, location.hash)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const [isMobileMenuRequested, setIsMobileOpen] = useState(false)
  const isMobileOpen = isMobileMenuRequested && isMobileViewport
  const { copied: emailCopied, copy: copyEmail } = useCopyText(connectEmail)

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
    (item: DiscoverNavItem) => {
      if (item.kind === 'external') {
        const link = document.createElement('a')
        link.href = item.to
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.click()
        return
      }

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

  useEffect(() => {
    if (!isMobileOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileOpen(false)
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        setIsMobileOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('pointerdown', handlePointerDown, true)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [isMobileOpen])

  const handleSkipToContent = useCallback(() => {
    window.requestAnimationFrame(() => {
      const target = document.getElementById('main-content')
      if (target instanceof HTMLElement) {
        target.focus()
      }
    })
  }, [])

  const mobilePanelTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <>
      <a href="#main-content" className="skip-link" onClick={handleSkipToContent}>
        Skip to main content
      </a>

      <header
        className={cn(
          'navbar',
          !introComplete && 'navbar--intro-pending',
          introHandoffStarted && 'navbar--intro-handoff',
          isMobileOpen && 'navbar--mobile-open',
        )}
      >
        <div className="navbar__shell">
          <Link
            to="/"
            className="navbar__brand"
            onClick={() => {
              haptic('nav')
            }}
          >
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

          <div className="navbar__connect-wrap">
            <ConnectDropdown />
          </div>

          <div ref={mobileMenuRef} className="navbar__mobile-menu">
            <button
              type="button"
              className="navbar__mobile-toggle"
              onClick={() => {
                haptic(isMobileOpen ? 'menu-close' : 'menu-open')
                setIsMobileOpen((v) => !v)
              }}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              data-sound={isMobileOpen ? 'close' : 'open'}
            >
              {isMobileOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>

            <AnimatePresence initial={false}>
              {isMobileViewport && isMobileOpen && (
                <motion.section
                  id="mobile-navigation"
                  className="navbar__mobile-popover"
                  aria-label="Mobile navigation"
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={mobilePanelTransition}
                >
                  <ul className="navbar__mobile-list">
                    {navItems.map((item) => (
                      <li key={item.to}>
                        <a
                          href={item.to}
                          className="navbar__mobile-link"
                          target={item.kind === 'external' ? '_blank' : undefined}
                          rel={item.kind === 'external' ? 'noopener noreferrer' : undefined}
                          onClick={(event) => {
                            if (item.kind !== 'external') {
                              event.preventDefault()
                            }
                            haptic('nav')
                            setIsMobileOpen(false)
                            if (item.kind === 'external') {
                              return
                            }
                            handleSelect(item)
                          }}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="navbar__mobile-connect">
                    <p className="navbar__mobile-connect-label">Connect</p>

                    <button
                      type="button"
                      className={cn(
                        'navbar__mobile-email',
                        emailCopied && 'navbar__mobile-email--copied',
                      )}
                      onClick={async () => {
                        const didCopy = await copyEmail()
                        if (didCopy) {
                          haptic('success')
                        }
                      }}
                      data-sound={emailCopied ? 'success' : 'press'}
                    >
                      {emailCopied ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Email copied</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          <span>Copy email</span>
                        </>
                      )}
                    </button>

                    <ul className="navbar__mobile-socials">
                      {connectLinks
                        .filter((link) => link.kind === 'external')
                        .map((link) => (
                          <li key={link.key}>
                            <a
                              className="navbar__mobile-social"
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                haptic('click')
                                setIsMobileOpen(false)
                              }}
                              data-sound="press"
                            >
                              <span className="navbar__mobile-social-icon">
                                {MOBILE_SOCIAL_ICONS[link.key]}
                              </span>
                              <span>{link.label}</span>
                              <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  )
}
