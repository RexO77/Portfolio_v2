import { type PropsWithChildren } from 'react'
import { IntroStateContext, type IntroState } from './intro-state'

interface IntroStateProviderProps extends PropsWithChildren {
  value: IntroState
}

export function IntroStateProvider({
  children,
  value,
}: IntroStateProviderProps) {
  return (
    <IntroStateContext.Provider value={value}>
      {children}
    </IntroStateContext.Provider>
  )
}
