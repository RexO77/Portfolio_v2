import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { CursorDialog } from '@/components/CursorDialog'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { ProjectCard } from '@/components/ProjectCard'
import { ExperienceDial } from '@/components/work/ExperienceDial'
import { homePageContent } from '@/content/home'
import { featuredProjects } from '@/content/projects'
import {
  workExperiences,
  workExperienceTimelineYears,
} from '@/content/work-experience'
import { useIntroState } from '@/features/intro/useIntroState'
import { useStartupRouteReady } from '@/features/intro/useStartupRouteReady'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  type CursorDialogPoint,
  resolveCursorDialogPoint,
} from '@/lib/cursor-dialog'
import '@/styles/experience-dial.css'

const CHAR_STAGGER = 0.022
const BASE_DELAY = 0.08

const TEXT_LINES = homePageContent.hero.lines
const HERO_CHARACTER_LINES = (() => {
  let charIndex = 0

  return TEXT_LINES.map((line, lineIndex) =>
    line.split('').map((char, charIndexInLine) => {
      const item = {
        key: `${lineIndex}-${charIndexInLine}`,
        char,
        delay: BASE_DELAY + charIndex * CHAR_STAGGER,
      }

      charIndex += 1
      return item
    }),
  )
})()

const totalChars = HERO_CHARACTER_LINES.reduce(
  (count, line) => count + line.length,
  0,
)
const ENTRANCE_DURATION = (BASE_DELAY + totalChars * CHAR_STAGGER) * 1000 + 450
const HERO_CURSOR_DIALOG_LABEL = 'Hover the letters'
const DIAL_CURSOR_DIALOG_LABEL = 'Drag the dial'
const INITIAL_CURSOR_DIALOG_POINT: CursorDialogPoint = { x: 0, y: 0 }

export default function HomePage() {
  const { introHandoffStarted, introComplete } = useIntroState()
  const [ready, setReady] = useState(false)
  const heroRevealStarted = introHandoffStarted || introComplete

  useStartupRouteReady()

  useEffect(() => {
    if (!heroRevealStarted) {
      return undefined
    }

    const id = setTimeout(() => setReady(true), ENTRANCE_DURATION)
    return () => clearTimeout(id)
  }, [heroRevealStarted])

  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1} className="homepage">
        <div className="glow-orb" aria-hidden="true">
          <div className="glow-layer glow-green" />
          <div className="glow-layer glow-yellow" />
          <div className="glow-layer glow-blue" />
          <div className="glow-layer glow-pink" />
        </div>

        <HeroSection animate={heroRevealStarted} ready={ready} />

        <div className="homepage__anchor" id="labs" aria-hidden="true" />
        <div className="projects-section" id="work">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} trackIntroLoad />
          ))}
        </div>

        <ExperienceSection />
        <Footer />
      </main>
    </>
  )
}

function HeroSection({ animate, ready }: { animate: boolean; ready: boolean }) {
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [hintDismissed, setHintDismissed] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [hintPoint, setHintPoint] = useState<CursorDialogPoint>(
    INITIAL_CURSOR_DIALOG_POINT,
  )
  const dismissTimeoutRef = useRef<number | null>(null)

  const canShowHint = ready && canHover && !hintDismissed

  useEffect(() => {
    return () => {
      if (dismissTimeoutRef.current !== null) {
        window.clearTimeout(dismissTimeoutRef.current)
      }
    }
  }, [])

  const updateHintPosition = (event: ReactPointerEvent<HTMLElement>) => {
    if (!canShowHint || event.pointerType === 'touch') {
      return
    }

    setHintPoint(
      resolveCursorDialogPoint({
        clientX: event.clientX,
        clientY: event.clientY,
        rect: event.currentTarget.getBoundingClientRect(),
      }),
    )
    setHintVisible(true)
  }

  const handleCharacterDiscover = (event: ReactPointerEvent<HTMLHeadingElement>) => {
    if (!canShowHint) {
      return
    }

    const target = event.target
    if (!(target instanceof HTMLElement)) {
      return
    }

    if (!target.closest('.hero__char')) {
      return
    }

    if (dismissTimeoutRef.current !== null) {
      return
    }

    dismissTimeoutRef.current = window.setTimeout(() => {
      setHintDismissed(true)
      setHintVisible(false)
      dismissTimeoutRef.current = null
    }, 480)
  }

  return (
    <section
      className="hero-region"
      onPointerEnter={updateHintPosition}
      onPointerMove={updateHintPosition}
      onPointerLeave={() => {
        if (dismissTimeoutRef.current !== null) {
          window.clearTimeout(dismissTimeoutRef.current)
          dismissTimeoutRef.current = null
        }
        setHintVisible(false)
      }}
    >
      {/*
      <CursorDialog
        label={HERO_CURSOR_DIALOG_LABEL}
        visible={canShowHint && hintVisible}
        point={hintPoint}
        className="cursor-dialog--hero"
      />
      */}

      <div className="hero">
        <div className="hero__text-wrapper">
          <h1
            className={`hero__heading${ready ? ' hero__heading--ready' : ''}`}
            onPointerOverCapture={handleCharacterDiscover}
          >
            <HeroTextCSS animate={animate} />
          </h1>
        </div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [hintDismissed, setHintDismissed] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [hintPoint, setHintPoint] = useState<CursorDialogPoint>(
    INITIAL_CURSOR_DIALOG_POINT,
  )

  const canShowHint = canHover && !hintDismissed

  const updateHintPosition = (event: ReactPointerEvent<HTMLElement>) => {
    if (!canShowHint || event.pointerType === 'touch') {
      return
    }

    setHintPoint(
      resolveCursorDialogPoint({
        clientX: event.clientX,
        clientY: event.clientY,
        rect: event.currentTarget.getBoundingClientRect(),
      }),
    )
    setHintVisible(true)
  }

  const handleDialDiscover = (event: ReactPointerEvent<HTMLElement>) => {
    if (!canShowHint) {
      return
    }

    const target = event.target
    if (!(target instanceof HTMLElement)) {
      return
    }

    if (!target.closest('.experience-dial__ruler')) {
      return
    }

    setHintDismissed(true)
    setHintVisible(false)
  }

  return (
    <section
      className="experience-section"
      id="experience"
      aria-label="Work experience"
      onPointerEnter={updateHintPosition}
      onPointerMove={updateHintPosition}
      onPointerLeave={() => setHintVisible(false)}
      onPointerDownCapture={handleDialDiscover}
    >
      <CursorDialog
        label={DIAL_CURSOR_DIALOG_LABEL}
        visible={canShowHint && hintVisible}
        point={hintPoint}
        className="cursor-dialog--dial"
      />

      <ExperienceDial
        items={workExperiences}
        timelineYears={workExperienceTimelineYears}
      />
    </section>
  )
}

function HeroTextCSS({ animate }: { animate: boolean }) {
  return (
    <>
      {HERO_CHARACTER_LINES.map((line, lineIdx) => (
        <span key={lineIdx} className="hero__heading-line">
          {line.map(({ key, char, delay }) => (
            <span
              key={key}
              className={`hero__char${animate ? ' hero__char--armed' : ''}`}
              style={animate ? { animationDelay: `${delay}s` } : undefined}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </>
  )
}
