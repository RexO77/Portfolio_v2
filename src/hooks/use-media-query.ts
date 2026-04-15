import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string, defaultValue = false) {
  const getSnapshot = () => {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    return window.matchMedia(query).matches
  }

  const subscribe = (onStoreChange: () => void) => {
    if (typeof window === 'undefined') {
      return () => {}
    }

    const mediaQueryList = window.matchMedia(query)
    const handleChange = () => onStoreChange()

    mediaQueryList.addEventListener('change', handleChange)

    return () => mediaQueryList.removeEventListener('change', handleChange)
  }

  return useSyncExternalStore(subscribe, getSnapshot, () => defaultValue)
}
