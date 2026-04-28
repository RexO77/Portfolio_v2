import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  GitHub,
  LinkedIn,
  Mail,
  Twitter,
} from '@/components/icons'
import { connectEmail, connectLinks, type ConnectLink } from '@/content/site'
import { useCopyText } from '@/hooks/use-copy-text'
import { useHaptics } from '@/hooks/use-haptics'
import { cn } from '@/lib/utils'

interface ConnectDropdownProps {
  className?: string
}

const ICONS: Record<string, ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  github: <GitHub className="h-4 w-4" />,
  linkedin: <LinkedIn className="h-4 w-4" />,
  resume: <FileText className="h-4 w-4" />,
}

export function ConnectDropdown({ className }: ConnectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const menuId = useId()
  const triggerId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimeoutRef = useRef<number | null>(null)
  const { haptic } = useHaptics()
  const { copied: emailCopied, copy: copyEmail, resetCopied } = useCopyText(connectEmail)

  const clearTimeoutRef = (timeoutRef: MutableRefObject<number | null>) => {
    if (timeoutRef.current === null) {
      return
    }

    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  const resetCopyState = useCallback(() => {
    resetCopied()
  }, [resetCopied])

  const closeMenu = useCallback(() => {
    clearTimeoutRef(closeTimeoutRef)
    resetCopyState()
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [resetCopyState])

  const handleOptionClick = useCallback(
    async (option: ConnectLink) => {
      if (option.kind === 'copy-email') {
        const didCopy = await copyEmail()
        if (!didCopy) {
          closeMenu()
          return
        }

        haptic('success')
        clearTimeoutRef(closeTimeoutRef)
        closeTimeoutRef.current = window.setTimeout(() => {
          closeTimeoutRef.current = null
          closeMenu()
        }, 1500)
        return
      }

      haptic('click')
      closeMenu()
    },
    [closeMenu, copyEmail, haptic],
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [closeMenu, isOpen])

  useEffect(() => {
    return () => {
      clearTimeoutRef(closeTimeoutRef)
    }
  }, [])

  const menuTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 320, damping: 34, mass: 0.78 }

  const itemTransition = (index: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { duration: 0.22, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <div
      ref={rootRef}
      className={cn('navbar__connect', className)}
      onKeyDownCapture={(event) => {
        if (event.key !== 'Escape') {
          return
        }

        event.stopPropagation()
        closeMenu()
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          'navbar__connect-trigger',
          isOpen && 'navbar__connect-trigger--open',
        )}
        onMouseDown={(event) => {
          event.preventDefault()
        }}
        onClick={() => {
          if (isOpen) {
            haptic('menu-close')
            closeMenu()
            return
          }

          resetCopyState()
          haptic('menu-open')
          setIsOpen(true)
        }}
        aria-expanded={isOpen}
        aria-controls={menuId}
        id={triggerId}
      >
        <span className="navbar__connect-label">{"Let's chat"}</span>
        <motion.span
          className="navbar__connect-caret"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            aria-labelledby={triggerId}
            className="navbar__connect-menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={menuTransition}
          >
            <ul className="navbar__connect-list">
              {connectLinks.map((option, index) => {
                const isEmail = option.kind === 'copy-email'
                const showCopied = isEmail && emailCopied
                const icon = ICONS[option.key] ?? null

                if (isEmail) {
                  return (
                    <motion.li
                      key={option.key}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 4 }}
                      transition={itemTransition(index)}
                    >
                      <button
                        type="button"
                        className={cn(
                          'navbar__connect-item',
                          showCopied && 'navbar__connect-item--copied',
                        )}
                        onClick={() => {
                          void handleOptionClick(option)
                        }}
                      >
                        <span className="navbar__connect-icon">
                          {showCopied ? <Check className="h-4 w-4" /> : icon}
                        </span>
                        <span className="navbar__connect-item-label">
                          {showCopied ? 'Copied!' : option.label}
                        </span>
                        {!showCopied && (
                          <span className="navbar__connect-item-hint" aria-hidden>
                            <Copy className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    </motion.li>
                  )
                }

                return (
                  <motion.li
                    key={option.key}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4 }}
                    transition={itemTransition(index)}
                  >
                    <a
                      href={option.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="navbar__connect-item"
                      onClick={() => {
                        void handleOptionClick(option)
                      }}
                    >
                      <span className="navbar__connect-icon">
                        {icon}
                        {option.active && (
                          <span
                            className="navbar__connect-icon-dot"
                            aria-hidden
                          />
                        )}
                      </span>
                      <span className="navbar__connect-item-label">
                        {option.label}
                      </span>
                      <span className="navbar__connect-item-hint" aria-hidden>
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </a>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
