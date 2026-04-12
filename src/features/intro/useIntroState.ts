import { useContext } from 'react'
import { IntroStateContext } from './intro-state'

export function useIntroState() {
  const context = useContext(IntroStateContext)

  if (!context) {
    throw new Error('useIntroState must be used within IntroStateProvider')
  }

  return context
}
