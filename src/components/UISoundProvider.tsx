import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import {
  consumeUISoundNavigationIntent,
  getClosestUISoundTarget,
  getDelegatedUISoundCue,
  getLastUISoundRequestAt,
  isDisabledUISoundTarget,
  isInternalNavigationTarget,
  markUISoundNavigationIntent,
  playUISound,
  primeUISounds,
  unlockUISounds,
} from '@/lib/ui-sound'

const RECENT_SOUND_REQUEST_WINDOW_MS = 80

const isKeyboardActivation = (event: KeyboardEvent, element: HTMLElement) => {
  if (event.repeat) {
    return false
  }

  const isButtonLike = Boolean(
    element.closest('button, [role="button"], input[type="submit"], input[type="button"]'),
  )
  const isAnchor = Boolean(element.closest('a[href]'))

  if (event.key === 'Enter') {
    return isButtonLike || isAnchor
  }

  return (event.key === ' ' || event.key === 'Spacebar') && isButtonLike
}

const UISoundProvider = () => {
  const location = useLocation()
  const lastRouteRef = useRef(`${location.pathname}${location.search}${location.hash}`)

  useEffect(() => {
    primeUISounds()
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || event.defaultPrevented) {
        return
      }

      const target = getClosestUISoundTarget(event.target)
      if (target && isDisabledUISoundTarget(target)) {
        return
      }

      void unlockUISounds()
    }

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.defaultPrevented) {
        return
      }

      const target = getClosestUISoundTarget(event.target)
      if (target && isDisabledUISoundTarget(target)) {
        return
      }

      if (target && isInternalNavigationTarget(target, event)) {
        markUISoundNavigationIntent()
        return
      }

      const cue = target ? getDelegatedUISoundCue(target) : 'press'
      if (!cue || cue === 'off') {
        return
      }

      const lastRequestedAt = getLastUISoundRequestAt()
      if (cue === 'press' && performance.now() - lastRequestedAt < RECENT_SOUND_REQUEST_WINDOW_MS) {
        return
      }

      queueMicrotask(() => {
        if (getLastUISoundRequestAt() > lastRequestedAt) {
          return
        }

        void playUISound(cue)
      })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }

      const target = getClosestUISoundTarget(event.target)
      if (!target || isDisabledUISoundTarget(target) || !isKeyboardActivation(event, target)) {
        return
      }

      void unlockUISounds()

      if (isInternalNavigationTarget(target, event)) {
        markUISoundNavigationIntent()
        return
      }

      const cue = getDelegatedUISoundCue(target)
      if (cue && cue !== 'off') {
        void playUISound(cue)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [])

  useEffect(() => {
    const currentRoute = `${location.pathname}${location.search}${location.hash}`
    if (lastRouteRef.current === currentRoute) {
      return
    }

    lastRouteRef.current = currentRoute

    if (consumeUISoundNavigationIntent()) {
      void playUISound('nav')
    }
  }, [location.hash, location.pathname, location.search])

  return null
}

export default UISoundProvider
