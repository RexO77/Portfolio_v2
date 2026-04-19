import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import {
  consumeUISoundNavigationIntent,
  getClosestUISoundTarget,
  getDelegatedUISoundCue,
  getInternalNavigationRoute,
  getLastUISoundRequestAt,
  isDisabledUISoundTarget,
  markUISoundNavigationIntent,
  markUISoundNavigationIntentFromStart,
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
  const lastPointerDrivenTargetRef = useRef<HTMLElement | null>(null)
  const lastPointerDrivenAtRef = useRef(0)

  useEffect(() => {
    primeUISounds()
  }, [])

  useEffect(() => {
    const markPointerDrivenTarget = (target: HTMLElement | null) => {
      lastPointerDrivenTargetRef.current = target
      lastPointerDrivenAtRef.current = performance.now()
    }

    const isRecentPointerDrivenTarget = (target: HTMLElement | null) => {
      if (!target) {
        return false
      }

      return (
        lastPointerDrivenTargetRef.current === target
        && performance.now() - lastPointerDrivenAtRef.current < 450
      )
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || event.defaultPrevented) {
        return
      }

      const target = getClosestUISoundTarget(event.target)
      if (target && isDisabledUISoundTarget(target)) {
        return
      }

      markPointerDrivenTarget(target)
      void unlockUISounds()

      if (!target) {
        return
      }

      const navigationRoute = getInternalNavigationRoute(target, event)
      if (navigationRoute) {
        markUISoundNavigationIntentFromStart(navigationRoute)
        void playUISound('nav')
        return
      }

      const cue = getDelegatedUISoundCue(target)
      if (!cue || cue === 'off') {
        return
      }

      const lastRequestedAt = getLastUISoundRequestAt()
      if (cue === 'press' && performance.now() - lastRequestedAt < RECENT_SOUND_REQUEST_WINDOW_MS) {
        return
      }

      void playUISound(cue)
    }

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.defaultPrevented) {
        return
      }

      const target = getClosestUISoundTarget(event.target)
      if (target && isDisabledUISoundTarget(target)) {
        return
      }

      if (isRecentPointerDrivenTarget(target)) {
        return
      }

      const navigationRoute = target ? getInternalNavigationRoute(target, event) : null
      if (navigationRoute) {
        markUISoundNavigationIntent(navigationRoute)
        return
      }

      const cue = target ? getDelegatedUISoundCue(target) : null
      if (!cue || cue === 'off') {
        return
      }

      void playUISound(cue)
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

      const navigationRoute = getInternalNavigationRoute(target, event)
      if (navigationRoute) {
        markUISoundNavigationIntentFromStart(navigationRoute)
        void playUISound('nav')
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

    if (consumeUISoundNavigationIntent(currentRoute)) {
      void playUISound('nav')
    }
  }, [location.hash, location.pathname, location.search])

  return null
}

export default UISoundProvider
