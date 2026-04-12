import { createContext } from 'react'

export interface IntroState {
  isIntroActive: boolean
  introHandoffStarted: boolean
  introComplete: boolean
  markStartupRouteReady: () => void
  registerStartupAsset: (assetId: string) => void
  resolveStartupAsset: (assetId: string) => void
}

export const IntroStateContext = createContext<IntroState | null>(null)
