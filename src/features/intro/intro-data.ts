export type IntroScript =
  | 'latin'
  | 'devanagari'
  | 'bengali'
  | 'telugu'
  | 'tamil'
  | 'arabic'
  | 'gujarati'
  | 'kannada'
  | 'malayalam'
  | 'gurmukhi'
  | 'oriya'

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
    greeting: 'नमस्कार',
    dir: 'ltr',
    script: 'devanagari',
  },
  {
    greeting: 'سلام',
    dir: 'rtl',
    script: 'arabic',
  },
  {
    greeting: 'નમસ્તે',
    dir: 'ltr',
    script: 'gujarati',
  },
  {
    greeting: 'നമസ്കാരം',
    dir: 'ltr',
    script: 'malayalam',
  },
  {
    greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
    dir: 'ltr',
    script: 'gurmukhi',
  },
  {
    greeting: 'ନମସ୍କାର',
    dir: 'ltr',
    script: 'oriya',
  },
  {
    greeting: 'নমস্কাৰ',
    dir: 'ltr',
    script: 'bengali',
  },
]
