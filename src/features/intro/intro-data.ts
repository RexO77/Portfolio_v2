export type IntroScript =
  | 'latin'
  | 'devanagari'
  | 'bengali'
  | 'telugu'
  | 'tamil'
  | 'kannada'
  | 'malayalam'

export interface IntroGreeting {
  greeting: string
  dir: 'ltr' | 'rtl'
  script: IntroScript
}

export const introGreetings: IntroGreeting[] = [
  {
    greeting: 'Hello',
    dir: 'ltr',
    script: 'latin',
  },
  {
    greeting: 'ನಮಸ್ಕಾರ',
    dir: 'ltr',
    script: 'kannada',
  },
  {
    greeting: 'வணக்கம்',
    dir: 'ltr',
    script: 'tamil',
  },
  {
    greeting: 'నమస్కారం',
    dir: 'ltr',
    script: 'telugu',
  },
  {
    greeting: 'नमस्ते',
    dir: 'ltr',
    script: 'devanagari',
  },
  {
    greeting: 'নমস্কার',
    dir: 'ltr',
    script: 'bengali',
  },
  {
    greeting: 'നമസ്കാരം',
    dir: 'ltr',
    script: 'malayalam',
  },
]
