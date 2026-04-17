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
  Github,
  Linkedin,
  Mail,
  Twitter,
} from '@/components/icons'
import { connectEmail, connectLinks, type ConnectLink } from '@/content/site'
import { cn } from '@/lib/utils'

interface ConnectDropdownProps {
  className?: string
}

const ICONS: Record<string, ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  github: <Github className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  resume: <FileText className="h-4 w-4" />,
}

export function ConnectDropdown({ className }: ConnectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimeoutRef = useRef<number | null>(null)
  const copyResetTimeoutRef = useRef<number | null>(null)

  const clearTimeoutRef = (timeoutRef: MutableRefObject<number | null>) => {
    if (timeoutRef.current === null) {
      return
    }

    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  const resetCopyState = useCallback(() => {
    clearTimeoutRef(copyResetTimeoutRef)
    setEmailCopied(false)
  }, [])

  const closeMenu = useCallback(() => {
    clearTimeoutRef(closeTimeoutRef)
    resetCopyState()
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [resetCopyState])

  const showCopySuccess = useCallback(() => {
    setEmailCopied(true)
    clearTimeoutRef(copyResetTimeoutRef)
    copyResetTimeoutRef.current = window.setTimeout(() => {
      copyResetTimeoutRef.current = null
      setEmailCopied(false)
    }, 2000)
  }, [])

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(connectEmail)
      showCopySuccess()
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = connectEmail
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
      } catch {
        // ignore
      }
      document.body.removeChild(textArea)
      showCopySuccess()
    }
  }, [showCopySuccess])

  const handleOptionClick = useCallback(
    (option: ConnectLink) => {
      if (option.kind === 'copy-email') {
        void handleCopyEmail()
        clearTimeoutRef(closeTimeoutRef)
        closeTimeoutRef.current = window.setTimeout(() => {
          closeTimeoutRef.current = null
          closeMenu()
        }, 1500)
        return
      }
      closeMenu()
    },
    [closeMenu, handleCopyEmail],
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

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape, true)
    }
  }, [closeMenu, isOpen])

  useEffect(() => {
    return () => {
      clearTimeoutRef(closeTimeoutRef)
      clearTimeoutRef(copyResetTimeoutRef)
    }
  }, [])

  const menuTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 28, mass: 0.7 }

  const itemTransition = (index: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { duration: 0.18, delay: index * 0.035, ease: [0.16, 1, 0.3, 1] as const }

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
        onClick={() => {
          if (isOpen) {
            closeMenu()
            return
          }

          resetCopyState()
          setIsOpen(true)
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
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
            role="menu"
            aria-label="Let's chat"
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
                        role="menuitem"
                        className={cn(
                          'navbar__connect-item',
                          showCopied && 'navbar__connect-item--copied',
                        )}
                        onClick={() => handleOptionClick(option)}
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
                      role="menuitem"
                      href={option.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="navbar__connect-item"
                      onClick={() => handleOptionClick(option)}
                    >
                      <span className="navbar__connect-icon">
                        {icon}
                        {option.active && (
                          <span
                            className="navbar__connect-icon-dot"
                            aria-label="Active"
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
