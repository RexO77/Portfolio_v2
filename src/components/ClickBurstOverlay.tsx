import { useEffect } from 'react'
import { playUISound } from '@/lib/ui-sound'

const BURST_LINE_COUNT = 3
const BURST_ANIMATION_MS = 460
const BURST_CLEANUP_GRACE_MS = 160
const BURST_ROTATION_JITTER_DEG = 6

const INTERACTIVE_SELECTOR =
  'a[href], button, summary, label, select, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="option"], [role="checkbox"], [role="radio"], [role="switch"], [role="combobox"], [data-sound]'

const TEXT_EDITING_SELECTOR =
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable=""], [contenteditable="true"]'

const hasModifierKey = (event: PointerEvent) => {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
}

const isInteractiveTarget = (element: Element) => {
  return Boolean(element.closest(INTERACTIVE_SELECTOR))
}

const isTextEditingTarget = (element: Element) => {
  return Boolean(element.closest(TEXT_EDITING_SELECTOR))
}

const isOptedOutTarget = (element: Element) => {
  return Boolean(element.closest('[data-click-burst="off"]'))
}

const clearSelection = () => {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed) {
    return
  }

  selection.removeAllRanges()
}

const spawnBurst = (x: number, y: number) => {
  const container = document.createElement('span')
  container.className = 'click-burst'
  container.style.left = `${x}px`
  container.style.top = `${y}px`

  const jitter = (Math.random() * 2 - 1) * BURST_ROTATION_JITTER_DEG
  container.style.setProperty('--click-burst-rotation', `${jitter.toFixed(2)}deg`)

  for (let index = 0; index < BURST_LINE_COUNT; index += 1) {
    const ray = document.createElement('span')
    ray.className = 'click-burst__ray'
    const angle = (360 / BURST_LINE_COUNT) * index
    ray.style.setProperty('--click-burst-angle', `${angle}deg`)

    const line = document.createElement('span')
    line.className = 'click-burst__line'

    ray.appendChild(line)
    container.appendChild(ray)
  }

  document.body.appendChild(container)

  let cleaned = false
  const cleanup = () => {
    if (cleaned) {
      return
    }
    cleaned = true
    container.remove()
  }

  container.addEventListener('animationend', cleanup, { once: true })
  window.setTimeout(cleanup, BURST_ANIMATION_MS + BURST_CLEANUP_GRACE_MS)
}

const ClickBurstOverlay = () => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || event.defaultPrevented) {
        return
      }

      if (hasModifierKey(event)) {
        return
      }

      const target = event.target
      if (target instanceof Element) {
        if (
          isInteractiveTarget(target) ||
          isTextEditingTarget(target) ||
          isOptedOutTarget(target)
        ) {
          return
        }
      }

      if (!reducedMotionQuery.matches) {
        spawnBurst(event.clientX, event.clientY)
      }

      if (event.pointerType !== 'touch') {
        void playUISound('press')
      }
    }

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.defaultPrevented) {
        return
      }

      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      if (
        isInteractiveTarget(target) ||
        isTextEditingTarget(target) ||
        isOptedOutTarget(target)
      ) {
        return
      }

      clearSelection()
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  return null
}

export default ClickBurstOverlay
