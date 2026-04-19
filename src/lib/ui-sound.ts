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

interface NavigationIntent {
  playedOnStart: boolean
  route: string
}

const CUE_CONFIGS: Record<PlayableUISoundCue, CueConfig> = {
  press: {
    src: GLOBAL_UI_CLICK_SRC,
    gain: 0.22,
    playbackRate: 1,
    playbackRateJitter: 0,
    throttleMs: 40,
  },
  nav: {
    src: GLOBAL_UI_CLICK_SRC,
    gain: 0.22,
    playbackRate: 1,
    playbackRateJitter: 0,
    throttleMs: 40,
  },
  open: {
    src: GLOBAL_UI_CLICK_SRC,
    gain: 0.22,
    playbackRate: 1,
    playbackRateJitter: 0,
    throttleMs: 40,
  },
  close: {
    src: GLOBAL_UI_CLICK_SRC,
    gain: 0.22,
    playbackRate: 1,
    playbackRateJitter: 0,
    throttleMs: 40,
  },
  success: {
    src: GLOBAL_UI_CLICK_SRC,
    gain: 0.22,
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

  private audioFallbackPool = new Map<string, HTMLAudioElement[]>()

  private audioContext: AudioContext | null = null

  private audioContextCtor: AudioContextCtor | null = null

  private buffers = new Map<string, Promise<AudioBuffer>>()

  private decodedBuffers = new Map<string, AudioBuffer>()

  private lastPlayedAt = new Map<PlayableUISoundCue, number>()

  private navigationIntentExpiresAt = 0

  private pendingNavigationIntent: NavigationIntent | null = null

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
    PLAYABLE_UI_SOUND_CUES.forEach((cue) => {
      this.primeFallback(cue)
      if (this.isSupported()) {
        void this.decodeBuffer(cue).catch(() => {})
      }
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
    if (cue === 'off' || document.hidden) {
      return
    }

    this.lastRequestedAt = performance.now()

    if (!this.isSupported()) {
      void this.playFallback(cue)
      return
    }

    if (!this.unlocked) {
      const unlocked = await this.unlock()
      if (!unlocked) {
        void this.playFallback(cue)
        return
      }
    }

    const context = this.getAudioContext()
    if (!context) {
      void this.playFallback(cue)
      return
    }

    if (context.state === 'suspended') {
      try {
        await context.resume()
      } catch {
        void this.playFallback(cue)
        return
      }
    }

    if (context.state !== 'running') {
      void this.playFallback(cue)
      return
    }

    const config = CUE_CONFIGS[cue]
    const now = performance.now()
    const lastPlayedAt = this.lastPlayedAt.get(cue) ?? 0
    if (now - lastPlayedAt < config.throttleMs) {
      return
    }

    this.lastPlayedAt.set(cue, now)

    const readyBuffer = this.decodedBuffers.get(config.src)
    if (!readyBuffer) {
      void this.decodeBuffer(cue).catch(() => {})
      void this.playFallback(cue)
      return
    }

    try {
      if (document.hidden) {
        return
      }

      const source = context.createBufferSource()
      const gainNode = context.createGain()

      source.buffer = readyBuffer
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
      void this.playFallback(cue)
    }
  }

  markNavigationIntent(route: string, playedOnStart = false) {
    if (!this.isSupported()) {
      return
    }

    this.pendingNavigationIntent = {
      route,
      playedOnStart,
    }
    this.navigationIntentExpiresAt = performance.now() + INTERNAL_NAVIGATION_INTENT_TTL_MS
  }

  consumeNavigationIntent(currentRoute: string) {
    if (!this.isSupported()) {
      return false
    }

    const intent = this.pendingNavigationIntent
    const hasIntent =
      performance.now() <= this.navigationIntentExpiresAt
      && intent?.route === currentRoute

    if (hasIntent || performance.now() > this.navigationIntentExpiresAt) {
      this.navigationIntentExpiresAt = 0
      this.pendingNavigationIntent = null
    }

    return hasIntent ? !intent?.playedOnStart : false
  }

  getLastRequestedAt() {
    return this.lastRequestedAt
  }

  private async decodeBuffer(cue: PlayableUISoundCue) {
    const src = CUE_CONFIGS[cue].src
    const existingBuffer = this.decodedBuffers.get(src)
    if (existingBuffer) {
      return existingBuffer
    }

    const existingPromise = this.buffers.get(src)
    if (existingPromise) {
      return existingPromise
    }

    const decodePromise = this.fetchArrayBuffer(cue).then(async (arrayBuffer) => {
      const context = this.getAudioContext()
      if (!context) {
        throw new Error('Audio context unavailable')
      }

      const decodedBuffer = await context.decodeAudioData(arrayBuffer.slice(0))
      this.decodedBuffers.set(src, decodedBuffer)
      return decodedBuffer
    })

    this.buffers.set(
      src,
      decodePromise.catch((error) => {
        this.buffers.delete(src)
        throw error
      }),
    )

    return decodePromise
  }

  private fetchArrayBuffer(cue: PlayableUISoundCue) {
    const src = CUE_CONFIGS[cue].src
    const existingPromise = this.arrayBuffers.get(src)
    if (existingPromise) {
      return existingPromise
    }

    const fetchPromise = fetch(src)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Unable to load sound cue: ${cue}`)
        }

        return response.arrayBuffer()
      })
      .catch((error) => {
        this.arrayBuffers.delete(src)
        throw error
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

  private primeFallback(cue: PlayableUISoundCue) {
    const src = CUE_CONFIGS[cue].src
    if (this.audioFallbackPool.has(src) || typeof Audio === 'undefined') {
      return
    }

    const audio = new Audio(src)
    audio.preload = 'auto'
    audio.load()
    this.audioFallbackPool.set(src, [audio])
  }

  private async playFallback(cue: PlayableUISoundCue) {
    if (!UI_SOUND_ENABLED || typeof Audio === 'undefined') {
      return
    }

    const config = CUE_CONFIGS[cue]
    const src = config.src
    const pooled = this.audioFallbackPool.get(src) ?? []
    const reusableAudio = pooled.find((audio) => audio.paused || audio.ended)
    const audio = reusableAudio ?? new Audio(src)

    if (!reusableAudio) {
      pooled.push(audio)
      this.audioFallbackPool.set(src, pooled)
    }

    audio.currentTime = 0
    audio.volume = Math.min(1, Math.max(0, config.gain * 2.4))
    audio.playbackRate = config.playbackRate

    try {
      await audio.play()
    } catch {
      // Fail silently so interaction behavior is never blocked by audio.
    }
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

export const markUISoundNavigationIntentFromStart = (route: string) => {
  uiSoundEngine.markNavigationIntent(route, true)
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
