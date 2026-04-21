const TOUCH_DEVICE_QUERY = '(pointer: coarse)'

export type HapticPattern = number | number[]

function isTouchDevice() {
  if (typeof window === 'undefined') {
    return false
  }

  return (
    window.matchMedia(TOUCH_DEVICE_QUERY).matches ||
    navigator.maxTouchPoints > 0
  )
}

function canVibrate() {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator
}

function triggerIosHapticFallback() {
  if (typeof document === 'undefined') {
    return
  }

  const label = document.createElement('label')
  label.ariaHidden = 'true'
  label.style.display = 'none'

  const input = document.createElement('input')
  input.type = 'checkbox'
  input.setAttribute('switch', '')
  label.appendChild(input)

  const parent = document.body ?? document.documentElement

  try {
    parent.appendChild(label)
    label.click()
  } finally {
    label.remove()
  }
}

export function supportsHaptics() {
  return isTouchDevice() && (canVibrate() || typeof document !== 'undefined')
}

export function haptic(pattern: HapticPattern = 50) {
  try {
    if (!isTouchDevice()) {
      return false
    }

    if (canVibrate()) {
      navigator.vibrate(pattern)
      return true
    }

    triggerIosHapticFallback()
    return true
  } catch {
    return false
  }
}
