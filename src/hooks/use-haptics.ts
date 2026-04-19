import { useCallback } from 'react'
import { useWebHaptics } from 'web-haptics/react'
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

const PRESETS: Record<Exclude<HapticAction, 'off'>, string> = {
  click: 'light',
  primary: 'medium',
  nav: 'medium',
  'menu-open': 'soft',
  'menu-close': 'rigid',
  tab: 'selection',
  success: 'success',
  error: 'error',
}

export function useHaptics() {
  const hasCoarsePointer = useMediaQuery('(pointer: coarse)')
  const hasAnyCoarsePointer = useMediaQuery('(any-pointer: coarse)')
  const { trigger, cancel, isSupported } = useWebHaptics({
    debug: false,
    showSwitch: false,
  })

  const hasTouchPoints =
    typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0
  const isEnabled =
    isSupported && (hasCoarsePointer || hasAnyCoarsePointer || hasTouchPoints)

  const haptic = useCallback(
    (action: HapticAction) => {
      if (!isEnabled || action === 'off') {
        return
      }

      void trigger?.(PRESETS[action])
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
