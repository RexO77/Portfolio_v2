import { useReducedMotion, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { discoverNavBubbleTransition } from '@/lib/motion'

export interface DiscoverNavItem {
  label: string
  to: string
  kind: 'section' | 'route' | 'external'
}

interface DiscoverNavProps {
  items: readonly DiscoverNavItem[]
  activeItem: string | null
  onSelect: (item: DiscoverNavItem) => void
  className?: string
}

export function DiscoverNav({
  items,
  activeItem,
  onSelect,
  className,
}: DiscoverNavProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'relative isolate flex w-full items-center justify-between gap-1 rounded-full border border-black/8 bg-[rgba(255,248,232,0.76)] p-[0.3rem] shadow-[0_16px_44px_rgba(141,111,32,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl sm:w-fit sm:justify-start',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-px rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.68),rgba(255,255,255,0.1)_52%,rgba(125,232,63,0.1)_100%)]" />

      {items.map((item) => {
        const isActive = item.kind !== 'external' && item.to === activeItem

        return (
          <a
            key={item.to}
            href={item.to}
            target={item.kind === 'external' ? '_blank' : undefined}
            rel={item.kind === 'external' ? 'noopener noreferrer' : undefined}
            onClick={(event) => {
              event.preventDefault()
              onSelect(item)
            }}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'discover-nav__item--intro relative z-10 inline-flex min-h-[2.45rem] flex-1 items-center justify-center rounded-full px-3 py-2 text-[0.82rem] leading-none whitespace-nowrap transition-[color,transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] sm:flex-none md:min-h-[2.65rem] md:px-3.5 md:text-[0.92rem]',
              isActive
                ? 'text-[var(--color-bg)]'
                : 'text-[rgba(30,30,30,0.72)] active:scale-[0.98]',
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="discover-nav-bubble"
                className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#202020_0%,#3b352c_100%)] shadow-[0_14px_30px_rgba(30,30,30,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : discoverNavBubbleTransition
                }
              />
            ) : null}
            <span className="relative z-10">{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}
