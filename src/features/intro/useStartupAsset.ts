import { useCallback, useId, useLayoutEffect, useRef } from 'react'
import { useIntroState } from './useIntroState'

export function useStartupAsset(enabled: boolean) {
  const {
    introComplete,
    isIntroActive,
    registerStartupAsset,
    resolveStartupAsset,
  } = useIntroState()
  const assetId = useId()
  const isRegisteredRef = useRef(false)

  useLayoutEffect(() => {
    if (!enabled || !isIntroActive || introComplete) {
      return undefined
    }

    registerStartupAsset(assetId)
    isRegisteredRef.current = true

    return () => {
      if (!isRegisteredRef.current) {
        return
      }

      isRegisteredRef.current = false
      resolveStartupAsset(assetId)
    }
  }, [
    assetId,
    enabled,
    introComplete,
    isIntroActive,
    registerStartupAsset,
    resolveStartupAsset,
  ])

  return useCallback(() => {
    if (!isRegisteredRef.current) {
      return
    }

    isRegisteredRef.current = false
    resolveStartupAsset(assetId)
  }, [assetId, resolveStartupAsset])
}
