export const uiEase = [0.16, 1, 0.3, 1] as const

export const discoverNavBubbleTransition = {
  type: 'spring',
  stiffness: 460,
  damping: 34,
  mass: 0.85,
} as const

export const pageShellEnter = {
  opacity: 0,
  y: 18,
} as const

export const pageShellExit = {
  opacity: 0,
  y: -12,
} as const

export const pageShellTransition = {
  duration: 0.22,
  ease: uiEase,
} as const
