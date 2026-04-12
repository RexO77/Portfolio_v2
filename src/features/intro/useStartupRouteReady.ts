import { useLayoutEffect } from 'react'
import { useIntroState } from './useIntroState'

export function useStartupRouteReady() {
  const { markStartupRouteReady } = useIntroState()

  useLayoutEffect(() => {
    markStartupRouteReady()
  }, [markStartupRouteReady])
}
