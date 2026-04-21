import { useCallback } from 'react'
import {
  haptic as triggerHaptic,
  supportsHaptics,
  type HapticPattern,
} from '@/lib/haptic'
import { useMediaQuery } from '@/hooks/use-media-query'

export type HapticAction =
  | 'click'
  | 'primary'
  | 'nav'
  | 'menu-open'
  | 'menu-close'
  | 'tab'
  | 'success'
  | 'error'
  | 'off'

const PRESETS: Record<Exclude<HapticAction, 'off'>, HapticPattern> = {
  click: 12,
  primary: 20,
  nav: 16,
  'menu-open': 10,
  'menu-close': [10, 20, 14],
  tab: 8,
  success: [18, 24, 18],
  error: [32, 28, 24],
}

export function useHaptics() {
  const hasCoarsePointer = useMediaQuery('(pointer: coarse)')
  const hasAnyCoarsePointer = useMediaQuery('(any-pointer: coarse)')
  const hasTouchPoints =
    typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0
  const isSupported = supportsHaptics()
  const isEnabled = isSupported && (hasCoarsePointer || hasAnyCoarsePointer || hasTouchPoints)

  const trigger = useCallback((pattern: HapticPattern = 50) => {
    return triggerHaptic(pattern)
  }, [])

  const cancel = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(0)
    }
  }, [])

  const haptic = useCallback(
    (action: HapticAction) => {
      if (!isEnabled || action === 'off') {
        return
      }

      trigger(PRESETS[action])
    },
    [isEnabled, trigger],
  )

  return {
    haptic,
    trigger,
    cancel,
    isSupported,
    isEnabled,
  }
}
