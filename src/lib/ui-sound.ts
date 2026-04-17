const PLAYABLE_UI_SOUND_CUES = ['press', 'nav', 'open', 'close', 'success'] as const

export type PlayableUISoundCue = typeof PLAYABLE_UI_SOUND_CUES[number]
export type UISoundCue = PlayableUISoundCue | 'off'

export const UI_SOUND_ENABLED = true

const INTERNAL_NAVIGATION_INTENT_TTL_MS = 2500
const GLOBAL_UI_CLICK_SRC = '/sounds/ui/click.wav'

interface CueConfig {
  gain: number
  playbackRate: number
  playbackRateJitter: number
  src: string
  throttleMs: number
}

const CUE_CONFIGS: Record<PlayableUISoundCue, CueConfig> = {
  press: {
    src: GLOBAL_UI_CLICK_SRC,
    gain: 0.11,
    playbackRate: 1,
    playbackRateJitter: 0,
    throttleMs: 40,
  },
  nav: {
    src: GLOBAL_UI_CLICK_SRC,
    gain: 0.11,
    playbackRate: 1,
    playbackRateJitter: 0,
    throttleMs: 40,
  },
  open: {
    src: GLOBAL_UI_CLICK_SRC,
    gain: 0.11,
    playbackRate: 1,
    playbackRateJitter: 0,
    throttleMs: 40,
  },
  close: {
    src: GLOBAL_UI_CLICK_SRC,
    gain: 0.11,
    playbackRate: 1,
    playbackRateJitter: 0,
    throttleMs: 40,
  },
  success: {
    src: GLOBAL_UI_CLICK_SRC,
    gain: 0.11,
    playbackRate: 1,
    playbackRateJitter: 0,
    throttleMs: 40,
  },
}

type AudioContextCtor = typeof AudioContext

interface LegacyWindow extends Window {
  webkitAudioContext?: AudioContextCtor
}

const VALID_UI_SOUND_CUES = new Set<UISoundCue>([...PLAYABLE_UI_SOUND_CUES, 'off'])

const isBrowser = typeof window !== 'undefined'

class UISoundEngine {
  private arrayBuffers = new Map<string, Promise<ArrayBuffer>>()

  private audioContext: AudioContext | null = null

  private audioContextCtor: AudioContextCtor | null = null

  private buffers = new Map<string, Promise<AudioBuffer>>()

  private lastPlayedAt = new Map<PlayableUISoundCue, number>()

  private navigationIntentExpiresAt = 0

  private pendingNavigationRoute: string | null = null

  private lastRequestedAt = 0

  private unlocked = false

  constructor() {
    if (!isBrowser) {
      return
    }

    const legacyWindow = window as LegacyWindow
    this.audioContextCtor = window.AudioContext ?? legacyWindow.webkitAudioContext ?? null
  }

  prime() {
    if (!this.isSupported()) {
      return
    }

    PLAYABLE_UI_SOUND_CUES.forEach((cue) => {
      void this.fetchArrayBuffer(cue).catch(() => {})
    })
  }

  async unlock() {
    if (!this.isSupported()) {
      return false
    }

    const context = this.getAudioContext()
    if (!context) {
      return false
    }

    if (context.state === 'suspended') {
      try {
        await context.resume()
      } catch {
        return false
      }
    }

    this.unlocked = context.state === 'running'

    if (this.unlocked) {
      PLAYABLE_UI_SOUND_CUES.forEach((cue) => {
        void this.decodeBuffer(cue).catch(() => {})
      })
    }

    return this.unlocked
  }

  async play(cue: UISoundCue) {
    if (!this.isSupported() || cue === 'off' || document.hidden) {
      return
    }

    this.lastRequestedAt = performance.now()

    if (!this.unlocked) {
      const unlocked = await this.unlock()
      if (!unlocked) {
        return
      }
    }

    const context = this.getAudioContext()
    if (!context) {
      return
    }

    if (context.state === 'suspended') {
      try {
        await context.resume()
      } catch {
        return
      }
    }

    if (context.state !== 'running') {
      return
    }

    const config = CUE_CONFIGS[cue]
    const now = performance.now()
    const lastPlayedAt = this.lastPlayedAt.get(cue) ?? 0
    if (now - lastPlayedAt < config.throttleMs) {
      return
    }

    this.lastPlayedAt.set(cue, now)

    try {
      const buffer = await this.decodeBuffer(cue)
      if (document.hidden) {
        return
      }

      const source = context.createBufferSource()
      const gainNode = context.createGain()

      source.buffer = buffer
      source.playbackRate.value = config.playbackRate + this.getJitter(config.playbackRateJitter)
      gainNode.gain.value = Math.max(0, config.gain + this.getJitter(0.01))

      source.connect(gainNode)
      gainNode.connect(context.destination)
      source.start()
      source.addEventListener(
        'ended',
        () => {
          source.disconnect()
          gainNode.disconnect()
        },
        { once: true },
      )
    } catch {
      // Fail silently so interaction behavior is never blocked by audio.
    }
  }

  markNavigationIntent(route: string) {
    if (!this.isSupported()) {
      return
    }

    this.pendingNavigationRoute = route
    this.navigationIntentExpiresAt = performance.now() + INTERNAL_NAVIGATION_INTENT_TTL_MS
  }

  consumeNavigationIntent(currentRoute: string) {
    if (!this.isSupported()) {
      return false
    }

    const hasIntent =
      performance.now() <= this.navigationIntentExpiresAt
      && this.pendingNavigationRoute === currentRoute

    if (hasIntent || performance.now() > this.navigationIntentExpiresAt) {
      this.navigationIntentExpiresAt = 0
      this.pendingNavigationRoute = null
    }

    return hasIntent
  }

  getLastRequestedAt() {
    return this.lastRequestedAt
  }

  private async decodeBuffer(cue: PlayableUISoundCue) {
    const src = CUE_CONFIGS[cue].src
    const existingPromise = this.buffers.get(src)
    if (existingPromise) {
      return existingPromise
    }

    const decodePromise = this.fetchArrayBuffer(cue).then(async (arrayBuffer) => {
      const context = this.getAudioContext()
      if (!context) {
        throw new Error('Audio context unavailable')
      }

      return context.decodeAudioData(arrayBuffer.slice(0))
    })

    this.buffers.set(src, decodePromise)
    return decodePromise
  }

  private fetchArrayBuffer(cue: PlayableUISoundCue) {
    const src = CUE_CONFIGS[cue].src
    const existingPromise = this.arrayBuffers.get(src)
    if (existingPromise) {
      return existingPromise
    }

    const fetchPromise = fetch(src).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Unable to load sound cue: ${cue}`)
      }

      return response.arrayBuffer()
    })

    this.arrayBuffers.set(src, fetchPromise)
    return fetchPromise
  }

  private getAudioContext() {
    if (!this.isSupported()) {
      return null
    }

    if (!this.audioContext) {
      this.audioContext = new this.audioContextCtor!()
    }

    return this.audioContext
  }

  private getJitter(amount: number) {
    return (Math.random() * 2 - 1) * amount
  }

  private isSupported() {
    return UI_SOUND_ENABLED && isBrowser && this.audioContextCtor !== null
  }
}

const uiSoundEngine = new UISoundEngine()

export const getClosestUISoundTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return null
  }

  return target.closest<HTMLElement>(
    '[data-sound], button, a[href], [role="button"], input[type="submit"], input[type="button"]',
  )
}

export const getDelegatedUISoundCue = (element: HTMLElement) => {
  const explicitCue = getExplicitUISoundCue(element)
  if (explicitCue) {
    return explicitCue
  }

  if (element.closest('button, [role="button"], input[type="submit"], input[type="button"]')) {
    return 'press'
  }

  const anchor = element.closest<HTMLAnchorElement>('a[href]')
  if (!anchor) {
    return null
  }

  const rawHref = anchor.getAttribute('href')
  if (!rawHref) {
    return null
  }

  if (rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
    return 'press'
  }

  const href = new URL(anchor.href, window.location.href)
  return href.origin === window.location.origin ? null : 'press'
}

export const getExplicitUISoundCue = (element: HTMLElement) => {
  const soundElement = element.closest<HTMLElement>('[data-sound]')
  if (!soundElement) {
    return null
  }

  const cue = soundElement.dataset.sound ?? null
  return isUISoundCue(cue) ? cue : null
}

export const isDisabledUISoundTarget = (element: HTMLElement) => {
  return Boolean(element.closest('button:disabled, input:disabled, [aria-disabled="true"]'))
}

export const isInternalNavigationTarget = (
  element: HTMLElement,
  event?:
    | Pick<MouseEvent, 'altKey' | 'button' | 'ctrlKey' | 'metaKey' | 'shiftKey'>
    | Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>,
) => {
  const anchor = element.closest<HTMLAnchorElement>('a[href]')
  if (!anchor || getExplicitUISoundCue(anchor) === 'off') {
    return false
  }

  if (anchor.target && anchor.target !== '_self') {
    return false
  }

  if (anchor.hasAttribute('download')) {
    return false
  }

  if (event && hasModifierKey(event)) {
    return false
  }

  if (event && 'button' in event && event.button !== 0) {
    return false
  }

  const rawHref = anchor.getAttribute('href')
  if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
    return false
  }

  const href = new URL(anchor.href, window.location.href)
  return href.origin === window.location.origin
}

export const getInternalNavigationRoute = (
  element: HTMLElement,
  event?:
    | Pick<MouseEvent, 'altKey' | 'button' | 'ctrlKey' | 'metaKey' | 'shiftKey'>
    | Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>,
) => {
  if (!isInternalNavigationTarget(element, event)) {
    return null
  }

  const anchor = element.closest<HTMLAnchorElement>('a[href]')
  if (!anchor) {
    return null
  }

  const href = new URL(anchor.href, window.location.href)
  const targetRoute = `${href.pathname}${href.search}${href.hash}`
  const currentRoute = `${window.location.pathname}${window.location.search}${window.location.hash}`

  return targetRoute === currentRoute ? null : targetRoute
}

export const markUISoundNavigationIntent = (route: string) => {
  uiSoundEngine.markNavigationIntent(route)
}

export const consumeUISoundNavigationIntent = (currentRoute: string) => {
  return uiSoundEngine.consumeNavigationIntent(currentRoute)
}

export const playUISound = (cue: UISoundCue) => {
  return uiSoundEngine.play(cue)
}

export const getLastUISoundRequestAt = () => {
  return uiSoundEngine.getLastRequestedAt()
}

export const primeUISounds = () => {
  uiSoundEngine.prime()
}

export const unlockUISounds = () => {
  return uiSoundEngine.unlock()
}

const hasModifierKey = (event: Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>) => {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
}

const isUISoundCue = (value: string | null): value is UISoundCue => {
  return value !== null && VALID_UI_SOUND_CUES.has(value as UISoundCue)
}
