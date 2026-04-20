import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppRouter } from '@/app/router'
import { IntroLoader } from '@/features/intro/IntroLoader'
import { IntroStateProvider } from '@/features/intro/IntroStateProvider'
import { type IntroState } from '@/features/intro/intro-state'

// IntroLoader runs 7 greetings × ~460ms ≈ 3.22s of sequence, plus a small
// font-preload delay before the first greeting paints. The sequence itself is
// the natural floor for how long the intro is visible, so this minimum only
// needs to cover the preload+app-mount window — keeping it below the sequence
// length avoids any artificial hold.
const INTRO_MIN_DURATION_MS = 2400

export default function App() {
  const [isIntroActive, setIsIntroActive] = useState(
    () => typeof window !== 'undefined',
  )
  const [introHandoffStarted, setIntroHandoffStarted] = useState(
    () => typeof window === 'undefined',
  )
  const [minimumElapsed, setMinimumElapsed] = useState(false)
  const [startupRouteReady, setStartupRouteReady] = useState(false)
  const [fontsReady, setFontsReady] = useState(() => {
    if (typeof document === 'undefined' || !('fonts' in document)) {
      return true
    }

    return document.fonts.status === 'loaded'
  })
  const [pendingStartupAssets, setPendingStartupAssets] = useState<Set<string>>(
    () => new Set(),
  )

  const handleIntroComplete = useCallback(() => {
    setIsIntroActive(false)
  }, [])

  const handleIntroExitStart = useCallback(() => {
    setIntroHandoffStarted(true)
  }, [])

  const markStartupRouteReady = useCallback(() => {
    setStartupRouteReady(true)
  }, [])

  const registerStartupAsset = useCallback((assetId: string) => {
    setPendingStartupAssets((previous) => {
      if (previous.has(assetId)) {
        return previous
      }

      const next = new Set(previous)
      next.add(assetId)
      return next
    })
  }, [])

  const resolveStartupAsset = useCallback((assetId: string) => {
    setPendingStartupAssets((previous) => {
      if (!previous.has(assetId)) {
        return previous
      }

      const next = new Set(previous)
      next.delete(assetId)
      return next
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setMinimumElapsed(true)
    }, INTRO_MIN_DURATION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (
      fontsReady ||
      typeof document === 'undefined' ||
      !('fonts' in document)
    ) {
      return undefined
    }

    let cancelled = false

    document.fonts.ready.then(() => {
      if (!cancelled) {
        setFontsReady(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [fontsReady])

  const introComplete = !isIntroActive
  const canExitIntro = minimumElapsed && startupRouteReady && fontsReady && pendingStartupAssets.size === 0

  const introState = useMemo<IntroState>(() => ({
    isIntroActive,
    introHandoffStarted,
    introComplete,
    markStartupRouteReady,
    registerStartupAsset,
    resolveStartupAsset,
  }), [
    introHandoffStarted,
    introComplete,
    isIntroActive,
    markStartupRouteReady,
    registerStartupAsset,
    resolveStartupAsset,
  ])

  return (
    <IntroStateProvider value={introState}>
      <AppRouter />
      {isIntroActive ? (
        <IntroLoader
          canExit={canExitIntro}
          onExitStart={handleIntroExitStart}
          onComplete={handleIntroComplete}
        />
      ) : null}
    </IntroStateProvider>
  )
}
